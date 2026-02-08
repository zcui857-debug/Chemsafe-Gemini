
import { GoogleGenAI, Type } from "@google/genai";
import { determineCategory } from "../logic.ts";
import { CATEGORY_NAMES } from "../constants.ts";
import { ChemicalInfo } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchChemicalInfo(cas: string): Promise<ChemicalInfo> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please provide information for the chemical with CAS number: ${cas}. 
    I need: 
    1. Chemical name (Chinese).
    2. GHS Hazard Statements (H-phrases like H225, H314, etc.).
    3. Whether it is combustible (true/false).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          hPhrases: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }
          },
          isCombustible: { type: Type.BOOLEAN }
        },
        required: ["name", "hPhrases", "isCombustible"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text.trim());
    const category = determineCategory(data.hPhrases, data.isCombustible);
    
    return {
      cas,
      name: data.name,
      hPhrases: data.hPhrases,
      isCombustible: data.isCombustible,
      category,
      categoryDesc: CATEGORY_NAMES[category] || '未知分类'
    };
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("解析化学品数据失败，请检查CAS号。");
  }
}
