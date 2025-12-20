
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCI5DVfAvEORjgtT1c171ZRRYG40iMii-E" });

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
    
    Full Evaluation Data:
    ${JSON.stringify(evaluationData, null, 2)}
    
    Report Structure (Arabic):
    1. Executive Summary: Overall impression of the candidate.
    2. Detailed Breakdown: For each section, list what they did well and what to focus on next based on the provided items.
    3. Final Decision: Clearly state if they are Ready, Almost Ready, or Not Ready Yet based on the total score.
    4. Pro Tips: Personalized advice for their career path.
    
    Use Markdown with beautiful formatting, emojis, and clear headings. 
    Ensure all points from the interviewer are accurately reflected.`;

    try {
      // تم تغيير النموذج إلى gemini-3-flash-preview استجابة لطلب نموذج flash
      // ولضمان استقرار الخدمة وتجنب أخطاء الـ Thinking Budget.
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
