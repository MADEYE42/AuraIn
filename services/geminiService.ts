
import { GoogleGenAI } from "@google/genai";
import type { StaffMember, SupplyItem, PredictionData } from '../types';

// FIX: Initialize Gemini AI client according to guidelines.
// The API key is assumed to be available in `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// FIX: Removed API key availability check.
const generateContent = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content from Gemini API:", error);
        return "An error occurred while generating the AI response. Please check the console for details.";
    }
};

export const generateStaffingRecommendations = async (
  staff: StaffMember[],
  predictions: PredictionData[]
): Promise<string> => {
  const staffData = JSON.stringify(staff.map(s => ({ specialty: s.specialty, status: s.status, shift: s.shift })), null, 2);
  const predictionData = JSON.stringify(predictions.find(p => p.day.includes('Diwali')), null, 2);

  const prompt = `
    You are Florence, an expert hospital administrator AI for a hospital in India, specializing in staffing optimization.
    Given the current staff list and a predicted 95% patient surge for the upcoming Diwali festival, provide a list of 3-4 actionable recommendations for staffing adjustments.
    Format the response as a simple list with each recommendation starting with a hyphen. Be concise and direct.

    Current Staff: ${staffData}
    Prediction: ${predictionData}
  `;
  return generateContent(prompt);
};

export const generateSupplyRecommendations = async (
  supplies: SupplyItem[],
  predictions: PredictionData[]
): Promise<string> => {
  const supplyData = JSON.stringify(supplies.map(s => ({ name: s.name, stock: s.stock, lowStockThreshold: s.lowStockThreshold, category: s.category })), null, 2);
  const predictionData = JSON.stringify(predictions.find(p => p.day.includes('Diwali')), null, 2);

  const prompt = `
    You are Caduceus, an expert hospital supply chain AI for a hospital in India.
    Given the current medical supply inventory and a predicted 95% patient surge for the upcoming Diwali festival (expecting respiratory and burn cases), provide a list of 3-4 critical procurement recommendations.
    Focus on items that are low in stock or will be in high demand.
    Format the response as a simple list with each recommendation starting with a hyphen. Be concise and direct.

    Current Supplies: ${supplyData}
    Prediction: ${predictionData}
  `;
  return generateContent(prompt);
};

export const generatePatientAdvisory = async (topic: string): Promise<string> => {
  const prompt = `
    You are Charaka, a public health communication AI for a major hospital in India.
    Write a clear, concise, and helpful patient advisory for the public on the following topic. The tone should be authoritative yet reassuring.
    The advisory should be around 100-150 words. Use bullet points for key recommendations.

    Topic: "${topic}"
  `;
  return generateContent(prompt);
};
