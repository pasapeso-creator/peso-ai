import { GoogleGenAI } from "@google/genai";
import { MODELS } from "../constants";

// --- API Key Management ---
const API_KEYS = (process.env.API_KEY || '').split(',').map(k => k.trim()).filter(k => k);
let currentKeyIndex = 0;

const getClient = () => {
  if (API_KEYS.length === 0) {
    console.error("No API keys found in environment variables!");
    return new GoogleGenAI({ apiKey: '' });
  }
  return new GoogleGenAI({ apiKey: API_KEYS[currentKeyIndex] });
};

const rotateKey = () => {
  if (API_KEYS.length <= 1) return false;
  
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  console.log(`Switched to API Key #${currentKeyIndex + 1}`);
  return true;
};

// Generic retry wrapper that handles rotation
const executeWithRetry = async <T>(operation: (ai: GoogleGenAI) => Promise<T>, description: string): Promise<T> => {
  let attempts = 0;
  // We allow retrying across all keys + some buffer for 503s
  const maxGlobalAttempts = API_KEYS.length * 3 + 3; 
  
  while (attempts < maxGlobalAttempts) {
    try {
      const ai = getClient();
      return await operation(ai);
    } catch (error: any) {
      attempts++;
      console.warn(`${description} Error (Attempt ${attempts}):`, error.message);

      // Case 1: Quota Exceeded (429) -> Rotate Key immediately
      if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED') || error.status === 429) {
        console.warn("Quota exceeded on current key. Switching key...");
        const rotated = rotateKey();
        if (rotated) {
          continue; // Retry immediately with new key
        } else {
          // No more keys to rotate to
          throw new Error("لقد تجاوزت الحد اليومي . يرجى المحاولة غداً.");
        }
      }

      // Case 2: Server Overloaded (503) -> Wait and Retry (same key)
      if (error.message?.includes('503') || error.message?.includes('overloaded') || error.status === 503) {
        console.warn("Server overloaded, waiting...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      // Case 3: Other errors -> Throw
      throw error;
    }
  }

  throw new Error(`فشل ${description} بعد عدة محاولات.`);
};

// --- Helper Functions ---
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getMimeType = (file: File): string => {
  const type = file.type;
  if (type) return type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'pdf': return 'application/pdf';
    default: return 'image/jpeg';
  }
};

// --- Exported Services ---

export const generateTextContent = async (prompt: string, systemInstruction?: string): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: MODELS.TEXT,
      contents: prompt,
      ...(systemInstruction && {
        config: { systemInstruction }
      })
    });
    return response.text || "عذراً، لم يتم إنشاء محتوى.";
  }, "Generating Text");
};

export const solveQuiz = async (question: string, imageBase64?: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  return executeWithRetry(async (ai) => {
    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: { mimeType, data: imageBase64 }
      });
    }
    parts.push({ text: question });

    const response = await ai.models.generateContent({
      model: MODELS.QUIZ,
      contents: { parts },
    });
    return response.text || "لم يتم العثور على إجابة.";
  }, "Solving Quiz");
};

export const solveSheet = async (file: File, prompt: string): Promise<string> => {
  const base64Data = await fileToGenerativePart(file);
  const mimeType = getMimeType(file);
  
  console.log(`Processing file: ${file.name}, Type: ${mimeType}`);

  return executeWithRetry(async (ai) => {
    const parts: any[] = [
      { inlineData: { mimeType, data: base64Data } },
      { text: prompt }
    ];

    const response = await ai.models.generateContent({
      model: MODELS.TEXT,
      contents: { parts },
      config: {
        systemInstruction: "You are an expert academic tutor and problem solver. Analyze the uploaded worksheet/sheet image carefully and solve ALL questions with detailed step-by-step explanations. Use LaTeX notation ($...$ for inline, $$...$$ for display) for mathematical formulas. Output must be in English."
      }
    });

    return response.text || "لم يتم العثور على حل.";
  }, "Solving Sheet");
};

