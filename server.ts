import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { parseDesignBriefDeterministically } from './src/engine/parser';
import { synthesizeDraftProposal, executeDeterministicSizing } from './src/engine/calculator';
import { ExtractedSpecs } from './src/types/electrical';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// API: Parse user natural language brief
app.post('/api/parse-brief', async (req, res) => {
  const { brief } = req.body;
  if (!brief || typeof brief !== 'string') {
    return res.status(400).json({ error: 'Brief text is required' });
  }

  // Fallback / deterministic result as baseline
  const deterministicResult = parseDesignBriefDeterministically(brief);

  // If Gemini API Key is available, use Gemini to enhance parsing and question generation
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({});
      const prompt = `You are an expert Electrical Design Assistant specializing in low-voltage (LV) motor-starter panels adhering to IEC (60947 series) and UL (UL 508A / UL 60947-4-1) standards.

CORE OPERATING RULES:
1. STRICT DETERMINISM: You DO NOT perform electrical sizing calculations, lookup component part numbers, or evaluate compliance rules yourself. You MUST map user intent to structured JSON payload calls for the external calculation/rules engine and component catalog.
2. ZERO HALLUCINATION: Never invent part numbers, busbar dimensions, heat dissipation figures, SCCR ratings, or wire gauge limits. All hardware specifics must come strictly from the supplied catalog or tool responses.
3. AMBIGUITY HANDLING: If essential sizing parameters (e.g., motor power, system voltage, starting method, control voltage, ambient temperature, enclosure NEMA/IP rating, SCCR requirements) are missing or ambiguous in the brief, STOP and flag them in missing_critical_params.
4. Output a JSON object with two top-level keys:
- "extracted_specs": Key-value pairs of identified parameters (systemVoltage [number], motorPowerKw [number], motorPowerHp [number], startingType ["DOL"|"STAR_DELTA"|"VFD"|"SOFT_STARTER"], controlVoltage ["24VDC"|"120VAC"|"230VAC"|"24VAC"], targetStandard ["IEC"|"UL"|"DUAL"], ambientTempC [number], enclosureType [string, e.g. "IP65" or "NEMA 12"], sccrKa [number], dutyType [string], fullLoadAmps [number]).
- "missing_critical_params": A list of missing parameters required for deterministic sizing (e.g., "system_voltage", "motor_power_rating", "starting_method", "control_circuit_voltage", "sccr_rating", "enclosure_rating").

If "missing_critical_params" is NOT empty, also provide "clarifying_questions": an array of 3-5 concise, professional questions asking the engineer to clarify before proceeding. Each item should have { "id": string, "paramKey": string, "question": string, "rationale": string, "recommendedOptions": [{"label": string, "value": any, "description": string}] }.

Design Brief:
"""
${brief}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsedText = response.text;
      if (parsedText) {
        const geminiJson = JSON.parse(parsedText);
        // Merge or return formatted output
        return res.json({
          source: 'gemini-ai',
          extracted_specs: geminiJson.extracted_specs || deterministicResult.extracted_specs,
          missing_critical_params: geminiJson.missing_critical_params || deterministicResult.missing_critical_params,
          clarifying_questions: geminiJson.clarifying_questions || deterministicResult.clarifying_questions,
        });
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to deterministic parser:', err?.message);
    }
  }

  // Deterministic engine fallback
  return res.json({
    source: 'deterministic-rules-engine',
    extracted_specs: deterministicResult.extracted_specs,
    missing_critical_params: deterministicResult.missing_critical_params,
    clarifying_questions: deterministicResult.clarifying_questions,
    raw_interpretation_notes: deterministicResult.raw_interpretation_notes,
  });
});

// API: Run Deterministic Calculation & Synthesis
app.post('/api/calculate-proposal', (req, res) => {
  const { specs } = req.body;
  if (!specs) {
    return res.status(400).json({ error: 'Electrical specs required' });
  }

  try {
    const proposal = synthesizeDraftProposal(specs as ExtractedSpecs);
    return res.json(proposal);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Calculation error' });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'IEC_UL_LV_MOTOR_ENGINE_v4.2.1-DETERMINISTIC' });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
