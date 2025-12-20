
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Agent for Interview Evaluation
 * Mimics LangChain functionality using standardized prompts and structured output.
 */
export const AIAgent = {
  /**
   * Suggests professional notes for a specific skill based on the score and context.
   */
  async suggestNote(skill: string, score: number, level: string, previousNotes?: string) {
    const labels = ['Not Demonstrated', 'Basic Awareness', 'Developing', 'Competent', 'Strong for Fresh Level'];
    const label = labels[score - 1];

    const prompt = `You are a professional technical recruiter and coach.
    Context: Evaluating a ${level} candidate.
    Skill being evaluated: ${skill}
    Score Given: ${score}/5 (${label})
    ${previousNotes ? `Previous feedback context: ${previousNotes}` : ''}
    
    Task: Write a concise, constructive "Coach Note" in Arabic for the interviewer. 
    The note should explain why this score might be given and what the candidate demonstrated or missed.
    Output only the note text in Arabic.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { temperature: 0.7 }
      });
      return response.text?.trim() || "لا توجد اقتراحات حالياً.";
    } catch (e) {
      console.error("AI Error:", e);
      return "حدث خطأ في جلب الاقتراح.";
    }
  },

  /**
   * Generates the final detailed report for the candidate.
   */
  async generateFinalReport(candidateName: string, interviewerName: string, level: string, evaluationData: any) {
    const prompt = `You are an expert technical career coach. 
    Generate a high-quality, professional, and encouraging "Software Engineering Interview Evaluation Report" in Arabic.
    
    Candidate Information:
    - Name: ${candidateName}
    - Role: ${level}
    - Interviewer: ${interviewerName}
    
    Full Evaluation Data (Sections, Skills, Scores, and Interviewer Notes):
    ${JSON.stringify(evaluationData, null, 2)}
    
    CRITICAL INSTRUCTIONS FOR THE REPORT STRUCTURE (Arabic):
    1. Executive Summary: Overall impression.
    2. Detailed Breakdown by Section:
       - For EACH SKILL within a section, you MUST display it as follows:
         * Skill Name & Score (e.g., Programming Logic: 4/5)
         * "ملاحظات المقيم المباشرة": [HERE YOU MUST INCLUDE THE VERBATIM NOTES WRITTEN BY THE INTERVIEWER FROM THE DATA PROVIDED]
         * "تحليل وتوصية": [Your AI coaching tip based on the score and note]
    3. Final Decision: Ready, Almost Ready, or Not Ready Yet.
    4. Pro Tips: Personalized advice.
    
    IMPORTANT: Do NOT summarize the interviewer notes into one paragraph. Keep them attached to each skill as "Direct Observations". If a note is empty, write "لم يتم إضافة ملاحظات إضافية".
    
    Use Markdown with beautiful formatting, emojis, and clear headings.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          temperature: 0.8
        }
      });
      return response.text;
    } catch (e) {
      console.error("AI Report Generation Error:", e);
      return null;
    }
  }
};
