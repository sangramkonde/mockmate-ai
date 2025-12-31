import { GoogleGenAI, Type } from "@google/genai";
import { Message, InterviewFeedback, JobConfig } from '../types';
import { FEEDBACK_MODEL } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseJobDescription = async (text: string): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    
    const prompt = `Extract a concise summary of the key technical skills, soft skills, and role responsibilities from this job description. Format it as a list suitable for briefing an interviewer. \n\nJob Description:\n${text}`;
    
    const response = await ai.models.generateContent({
        model: FEEDBACK_MODEL,
        contents: prompt,
    });
    
    return response.text || "Could not parse job description.";
};

export const generateFeedback = async (messages: Message[], jobConfig: JobConfig): Promise<InterviewFeedback> => {
    if (!process.env.API_KEY) throw new Error("API Key missing");

    const transcript = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    
    const prompt = `
    Analyze this interview transcript for a ${jobConfig.roleTitle} role.
    Role Context: ${jobConfig.jobDescription.substring(0, 300)}...
    
    Provide detailed feedback in JSON format strictly matching this schema:
    {
        strengths: string[],
        improvements: string[],
        scores: {
            communication: number (1-10),
            technical: number (1-10),
            problemSolving: number (1-10),
            culturalFit: number (1-10),
            overall: number (1-10)
        },
        summary: string,
        recommendations: string[]
    }

    Transcript:
    ${transcript}
    `;

    const response = await ai.models.generateContent({
        model: FEEDBACK_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    scores: {
                        type: Type.OBJECT,
                        properties: {
                            communication: { type: Type.NUMBER },
                            technical: { type: Type.NUMBER },
                            problemSolving: { type: Type.NUMBER },
                            culturalFit: { type: Type.NUMBER },
                            overall: { type: Type.NUMBER },
                        }
                    },
                    summary: { type: Type.STRING },
                    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            }
        }
    });

    const jsonStr = response.text || "{}";
    try {
        return JSON.parse(jsonStr) as InterviewFeedback;
    } catch (e) {
        console.error("Failed to parse feedback JSON", e);
        throw new Error("Could not generate feedback.");
    }
};
