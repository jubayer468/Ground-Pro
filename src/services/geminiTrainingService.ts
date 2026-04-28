/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface LessonContent {
  title: string;
  content: string;
  keyTakeaways: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function getLessonContent(moduleTitle: string, lessonTitle: string, level: 'standard' | 'professional' | 'simplified' = 'standard'): Promise<LessonContent> {
  const levelInstruction = {
    standard: "Provide a detailed, professional, and technical explanation.",
    professional: "Provide an advanced, highly technical analysis with deep industry terminology.",
    simplified: "Explain the concepts in simple terms for beginners."
  }[level];

  const prompt = `You are a world-class Cricket Pitch Curator.
  Technical Level: ${levelInstruction}
  Topic: "${lessonTitle}" 
  Course Module: "${moduleTitle}"
  
  Write a comprehensive technical manuscript in Markdown.
  Structure it with these headings:
  - ## Technical Scope
  - ## Critical Parameters
  - ## Operational Procedures
  - ## Maintenance Invariants
  Include a "CURATOR'S PRO TIP" callout using a blockquote.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "content", "keyTakeaways"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error:", e, "Text was:", text);
      throw new Error("Invalid technical manuscript format");
    }
  } catch (error) {
    console.error("Error fetching lesson content:", error);
    return {
      title: lessonTitle,
      content: "Error loading content. Please try again. Technical details: Connectivity to curator AI systems interrupted.",
      keyTakeaways: ["Check connection", "Retry lesson"]
    };
  }
}

export async function getModuleOverview(moduleTitle: string, description: string): Promise<string> {
  const prompt = `Based on this cricket pitch module titled "${moduleTitle}" and description: "${description}", 
  generate a concise, executive summary (2-3 paragraphs) that outlines the key learning goals and industry importance.
  Focus on technical standards and professional development. Return ONLY the text content in markdown format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching module overview:", error);
    return description;
  }
}

export async function getFinalAssignment(): Promise<QuizQuestion[]> {
  const prompt = `Generate a 10-question multiple choice certification exam for a Professional Cricket Curator.
  Topics include: Pitch Categorization, Maintenance, Seasonal Renovation, Moisture Management, and Construction Technology.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Quiz Parse Error:", e, "Text was:", text);
      return [];
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return [];
  }
}

export async function generateKnowledgeArticle(topic: string, depth: string): Promise<{ title: string; content: string; categories: string[]; keywords: string[] } | null> {
  const prompt = `You are a world-class Turf Management Scientist and Head Curator for an ICC-standard international cricket stadium.
  Generate a professional, highly detailed, and technical article on the following topic: "${topic}".
  Desired technical depth: ${depth} (from "Practical Basics" to "Ph.D. Level Research").
  
  The article must include:
  1. A compelling technical title.
  2. A detailed abstract or introduction.
  3. Technical analysis (mentioning specific science like Soil Mechanic, Turf Pathology, or Bio-chemistry where applicable).
  4. Practical implementation advice for groundsmen.
  5. 3-4 suggested categories for this article.
  6. 5-7 technical keywords.

  Return the response in STRICT JSON format. Ensure the content field is a valid string with markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            categories: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "content", "categories", "keywords"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Knowledge generation error:", error);
    return null;
  }
}
