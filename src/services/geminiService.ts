import { GoogleGenAI, Type } from "@google/genai";
import { SymptomData, DiagnosisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeSkinCondition(
  imageBase64: string,
  symptoms: SymptomData,
  language: 'en' | 'hi'
): Promise<DiagnosisResult> {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `You are a specialized dermatology AI assistant for the Indian market. 
            Analyze the provided skin image and symptom data.
            
            Symptoms:
            - Location: ${symptoms.bodyArea}
            - Duration: ${symptoms.duration}
            - Itching/Burning: ${symptoms.itchBurn ? 'Yes' : 'No'}
            - Spreading: ${symptoms.spreading ? 'Yes' : 'No'}
            - Allergies: ${symptoms.allergies || 'None'}
            
            Return a structured JSON response with:
            1. Top 3 likely conditions (name, hindiName, confidence, description).
            2. Urgency triage (NOW, WEEK, HOME).
            3. General advice (not a prescription).
            
            Be sensitive to brown/dark skin tones (Fitzpatrick IV-VI).
            The description and advice should be in ${language === 'hi' ? 'Hindi' : 'English'}.`
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64.split(',')[1] || imageBase64
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conditions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                hindiName: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ["High", "Possible", "Unlikely"] },
                description: { type: Type.STRING }
              },
              required: ["name", "hindiName", "confidence", "description"]
            }
          },
          urgency: { type: Type.STRING, enum: ["NOW", "WEEK", "HOME"] },
          advice: { type: Type.STRING }
        },
        required: ["conditions", "urgency", "advice"]
      }
    }
  });

  const response = await model;
  return JSON.parse(response.text || "{}") as DiagnosisResult;
}
