
import { GoogleGenAI, Type } from "@google/genai";
import { AppMode, ImageResolution, RouterResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Master Agent (Router) ---

export const routeUserIntent = async (userInput: string): Promise<RouterResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userInput,
      config: {
        systemInstruction: `You are the Master Agent of the Nexus AI Hub. Your job is to classify the user's intent and route them to the correct tool. The user may speak English or Spanish.
        
        Available Tools:
        1. IMAGE: For generating, creating, or designing images, photos, drawings, or art.
        2. CHAT: For general knowledge questions, coding help, advice, or conversation.
        3. EMAIL: For drafting, editing, or formatting emails.
        4. WORKFLOWS: If the user mentions "process", "pipeline", "sequence", "automation", or "connect tools".
        
        Rules:
        - If the user explicitly asks to generate an image, choose IMAGE.
        - If the user asks to write an email, choose EMAIL.
        - Otherwise, default to CHAT.
        - 'refinedPrompt' should be the optimized version of the user's request for that specific tool (translate to English if the tool works better in English, otherwise keep user's language).
        - 'reasoning' should explain why you chose this route.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetApp: {
              type: Type.STRING,
              enum: [AppMode.IMAGE, AppMode.CHAT, AppMode.EMAIL, AppMode.HUB, AppMode.WORKFLOWS],
            },
            refinedPrompt: {
              type: Type.STRING,
              description: "The prompt to pass to the target application.",
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of why this route was chosen.",
            },
          },
          required: ["targetApp", "refinedPrompt", "reasoning"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Router");
    
    return JSON.parse(text) as RouterResponse;
  } catch (error) {
    console.error("Routing error:", error);
    // Fallback to chat if routing fails
    return {
      targetApp: AppMode.CHAT,
      refinedPrompt: userInput,
      reasoning: "Routing failed, defaulting to Chat."
    };
  }
};

// --- General Chat ---

export const sendChatMessage = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      history: history,
      config: {
        systemInstruction: "You are a helpful AI assistant within the Nexus Hub. Respond in the same language as the user (Spanish or English).",
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};

// --- Workflow Specific Services ---

export const executeGeminiLogic = async (systemInstruction: string, inputData: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Input Data: ${inputData}`,
      config: {
        systemInstruction: systemInstruction || "You are a data processor. Analyze the input and provide the requested output.",
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    return `Error processing logic: ${error instanceof Error ? error.message : "Unknown"}`;
  }
};

export const simulateGithubAction = async (repoName: string, action: string, data: string): Promise<string> => {
  // Simulating an API call to GitHub
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `[GitHub Action Success]
  Repo: ${repoName}
  Action: ${action || 'Commit'}
  Files Updated: 1
  Data Payload: "${data.substring(0, 50)}..."`;
};

// --- Image Generation ---

export const generateImage = async (
  prompt: string, 
  resolution: ImageResolution = ImageResolution.RES_1K
): Promise<{ imageUrl: string | null; error?: string }> => {
  try {
    const model = 'gemini-3-pro-image-preview'; 

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: resolution, // 1K, 2K, or 4K
        },
      },
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return { imageUrl: `data:image/png;base64,${base64EncodeString}` };
      }
    }
    
    return { imageUrl: null, error: "No image data returned." };

  } catch (error) {
    console.error("Image generation error:", error);
    return { imageUrl: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
};
