import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * AI Agent for Interview Evaluation
 * Mimics LangChain functionality using standardized prompts and structured output.
 */
export const AIAgent = {
  /**
   * Suggests professional notes for a specific skill based on the score and context.
   */
  async suggestNote(skill: string, score: number, level: string, previousNotes?: string) {
    // Fix: API key must be obtained exclusively from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const labels = ['Not Demonstrated', 'Basic Awareness', 'Developing', 'Competent', 'Strong for Level'];
    const label = labels[score - 1] || 'Unknown';

    const prompt = `You are a professional technical recruiter and coach.
    Context: Evaluating a ${level} candidate.
    Skill being evaluated: ${skill}
    Score Given: ${score}/5 (${label})
    ${previousNotes ? `Previous feedback context: ${previousNotes}` : ''}
    
    Task: Write a concise, constructive "Coach Note" in Arabic for the interviewer. 
    The note should explain why this score might be given and what the candidate demonstrated or missed.
    Output only the note text in Arabic.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        // Basic Text Task
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 0 } // Disable thinking for latency
        }
      });
      // Fix: Access response.text property directly
      return response.text?.trim() || "لا توجد اقتراحات حالياً.";
    } catch (e: any) {
      console.error("AI Note Suggestion Error:", e);
      return "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى المحاولة لاحقاً.";
    }
  },

  /**
   * Generates the final detailed report for the candidate.
   */
  async generateFinalReport(candidateName: string, interviewerName: string, level: string, evaluationData: any) {
    // Fix: API key must be obtained exclusively from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `You are an expert technical career coach. 
    Generate a high-quality, professional, and encouraging "Software Engineering Interview Evaluation Report" in Arabic.
    
    Candidate Information:
    - Name: ${candidateName}
    - Role: ${level}
    - Interviewer: ${interviewerName}
    
    Full Evaluation Data (Sections, Skills, Scores, and Interviewer Notes):
    ${JSON.stringify(evaluationData, null, 2)}
    
    CRITICAL INSTRUCTIONS FOR THE REPORT MARKDOWN FORMAT (Arabic):
    
    1. Header: Use "# 📝 تقرير التقييم الفني"
    2. Candidate Summary: Use a table or bold list for Name, Level, and Final Result.
    
    3. FOR EACH SECTION:
       - Use "## [Section Title]"
       
    4. FOR EACH SKILL (The most important part):
       Follow this exact visual pattern:
       ### 🔹 [Skill Name] | النتيجة: [Score]/5
       > **💬 رأي المحاور المباشر:**
       > [INSERT VERBATIM NOTES FROM INTERVIEWER HERE. If empty, write "لم يتم إضافة ملاحظات إضافية من قبل المحاور."]
       
       💡 **تحليل وتوصية المقابل الذكي (AI Analysis):**
       [Provide a deep analysis and a specific actionable tip based on the score and interviewer's observation]
       
       --- (Horizontal line between skills)

    5. Final Summary & Roadmap:
       - Give a "Final Verdict" (e.g., Ready, Needs Practice).
       - Provide a "3-Step Growth Plan" based on the weaknesses found.

    IMPORTANT: 
    - Use clear spacing and bold headers. 
    - The Interviewer's notes MUST be clearly separated from your (AI) analysis using the blockquote style (">").
    - Use Markdown emojis to make it professional yet encouraging.`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        // Complex Text Task
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          temperature: 0.8,
          thinkingConfig: { thinkingBudget: 0 } // Fast generation
        }
      });
      // Fix: Access response.text property directly
      return response.text || null;
    } catch (e: any) {
      console.error("AI Report Generation Error:", e);
      return null;
    }
  }
};