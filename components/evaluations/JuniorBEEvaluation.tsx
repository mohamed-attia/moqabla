
import React, { useState } from 'react';
import { 
  CheckCircle, ChevronLeft, Sparkles, 
  Loader2, Brain, Target, Save, Edit3,
  X, Award, Zap, AlertTriangle, Info, Coffee, Box, Layout
} from 'lucide-react';
import Button from '../Button';
import { AIAgent } from '../../lib/ai-agent';
import { JUNIOR_BE_EVALUATION_TEMPLATE } from '../../lib/evaluation-templates';
import { EvaluationSection, EvaluationScore } from '../../types';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { sendUserStatusUpdateNotification } from '../../lib/notifications';
import ApiKeySelector from '../ApiKeySelector';

interface Props {
  registration: any;
  onComplete: () => void;
  onCancel: () => void;
  interviewerName?: string;
}

const JuniorBEEvaluation: React.FC<Props> = ({ registration, onComplete, onCancel, interviewerName }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  
  const [sections, setSections] = useState<EvaluationSection[]>(JSON.parse(JSON.stringify(JUNIOR_BE_EVALUATION_TEMPLATE)));

  const scoreLabels = ['Not Demonstrated', 'Basic Awareness', 'Developing', 'Competent', 'Strong Junior'];
  
  const calculateTotalScore = () => {
    let total = 0;
    sections.forEach(s => {
      const sectionAvg = s.items.reduce((sum, item) => sum + item.score, 0) / (s.items.length * 5);
      total += sectionAvg * s.weight;
    });
    return Math.round(total);
  };

  const updateScore = (sectionIdx: number, itemIdx: number, score: EvaluationScore) => {
    const newSections = [...sections];
    newSections[sectionIdx].items[itemIdx].score = score;
    setSections(newSections);
  };

  const updateNote = (sectionIdx: number, itemIdx: number, text: string) => {
    const newSections = [...sections];
    newSections[sectionIdx].items[itemIdx].notes = text;
    setSections(newSections);
  };

  const handleAiSuggest = async (sectionIdx: number, itemIdx: number) => {
    const item = sections[sectionIdx].items[itemIdx];
    setAiGenerating(`${sectionIdx}-${itemIdx}`);
    setApiError(null);
    
    try {
      const suggestion = await AIAgent.suggestNote(
          item.skill, 
          item.score, 
          'Junior Backend Engineer (Java / .NET expectation)'
      );
      if (suggestion.includes("خطأ") || suggestion.includes("API key not valid")) throw new Error(suggestion);
      updateNote(sectionIdx, itemIdx, suggestion);
    } catch (e) {
      setApiError("فشل في استدعاء الذكاء الاصطناعي. يرجى اختيار مفتاح صالح.");
    } finally {
      setAiGenerating(null);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setApiError(null);
    const totalScore = calculateTotalScore();
    const nameToDisplay = interviewerName || auth.currentUser?.displayName || "المقيم";
    
    try {
      const report = await AIAgent.generateFinalReport(
        registration.fullName,
        nameToDisplay,
        'Junior Backend Engineer',
        { 
          sections: sections.map(s => ({
            title: s.title,
            score: `${Math.round(s.items.reduce((sum, i) => sum + i.score, 0) / (s.items.length * 5) * s.weight)}/${s.weight}`,
            items: s.items.map(i => ({ skill: i.skill, score: i.score, notes: i.notes }))
          })),
          totalScore: `${totalScore}/100`,
          decision: totalScore >= 75 ? 'Ready for Junior Backend Developer' : totalScore >= 60 ? 'Needs More Practice' : 'Not Ready Yet'
        }
      );

      if (report) {
        setFinalReport(report);
        setIsReviewing(true);
      } else {
        setApiError("حدث خطأ في توليد التقرير.");
      }
    } catch (e) {
      setApiError("فشل في الوصول للمحرك.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const regRef = doc(db, "registrations", registration.id);
      await updateDoc(regRef, {
        status: 'completed',
        evaluationReport: finalReport,
        finalScore: calculateTotalScore(),
        completedAt: serverTimestamp(),
        interviewerId: auth.currentUser?.uid,
        interviewerName: interviewerName || auth.currentUser?.displayName || 'المحاور'
      });

      await sendUserStatusUpdateNotification({
        to_email: registration.email,
        user_name: registration.fullName,
        request_number: registration.requestNumber || registration.id,
        new_status: 'completed'
      });

      onComplete();
    } catch (e) {
      alert("خطأ أثناء الحفظ النهائي.");
    } finally {
      setLoading(false);
    }
  };

  const currentSection = sections[activeStep];
  const totalScore = calculateTotalScore();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl md:h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden relative">
        
        {/* Reference Button */}
        <button 
          onClick={() => setShowQuestions(!showQuestions)}
          className="absolute left-6 top-6 z-[110] bg-primary hover:bg-slate-800 text-white p-3 rounded-2xl border border-white/10 transition-all flex items-center gap-2 group"
        >
          <Info className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-black">الأسئلة والأساسيات</span>
        </button>

        <div className="bg-primary p-6 md:p-10 text-white relative shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center shadow-lg shadow-accent/20 animate-pulse">
                <Box className="w-9 h-9" />
              </div>
              <div className="text-right">
                <h2 className="text-xl md:text-2xl font-black">تقييم: {registration.fullName}</h2>
                <div className="flex items-center gap-2 text-accent/90 text-sm font-bold mt-1">
                  <Award className="w-4 h-4" />
                  <span>Junior Backend Assessment Flow</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">التقدم</div>
                <div className="text-xl font-black text-accent">{activeStep + 1} / {sections.length}</div>
              </div>
              <div className="h-12 w-px bg-white/10 hidden md:block"></div>
              <div className="text-left">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">الدرجة اللحظية</div>
                <div className={`text-4xl font-black transition-colors duration-500 ${totalScore >= 75 ? 'text-emerald-400' : totalScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {totalScore}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent shadow-[0_0_15px_rgba(13,148,136,0.8)] transition-all duration-700"
              style={{ width: `${((activeStep + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
          <div className={`flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-12 transition-all duration-500 ${showQuestions ? 'md:pr-4' : ''}`}>
            
            {!isReviewing ? (
              <>
                <ApiKeySelector onKeySelected={() => setApiError(null)} />

                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-in shake">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm font-bold">{apiError}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-gray-800">{currentSection.title}</h3>
                </div>

                <div className="space-y-16">
                  {currentSection.items.map((item, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="space-y-1 flex-grow">
                          <label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-primary/5 text-primary flex items-center justify-center text-xs">{i + 1}</span>
                            {item.skill}
                          </label>
                          <p className="text-xs text-gray-400 mr-9">قيم مهارات المرشح الجونيور في {item.skill}.</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 shrink-0 justify-end">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              onClick={() => updateScore(activeStep, i, s as EvaluationScore)}
                              className={`
                                group relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all transform hover:scale-105 active:scale-95
                                ${item.score === s 
                                  ? s >= 4 ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-100' :
                                    s === 3 ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-100' :
                                    'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-100'
                                  : 'bg-white border-gray-100 text-gray-400 hover:border-accent/30 hover:bg-accent/5'
                                }
                              `}
                            >
                              <span className="text-xl font-black leading-none">{s}</span>
                              <span className={`text-[8px] font-bold mt-1 text-center leading-tight opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-900 text-white px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none`}>
                                {scoreLabels[s - 1]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative group mr-9">
                        <div className="absolute -right-7 top-0 bottom-0 w-1 bg-gray-100 rounded-full group-focus-within:bg-accent transition-colors"></div>
                        <textarea
                          value={item.notes}
                          onChange={(e) => updateNote(activeStep, i, e.target.value)}
                          placeholder="أضف ملاحظاتك الفنية هنا..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-5 pr-5 pl-14 text-sm focus:bg-white focus:ring-2 focus:ring-accent outline-none min-h-[100px] transition-all text-right"
                        />
                        <button 
                          onClick={() => handleAiSuggest(activeStep, i)}
                          disabled={aiGenerating === `${activeStep}-${i}`}
                          className="absolute left-4 bottom-4 p-3 bg-white border border-gray-100 text-accent hover:bg-accent hover:text-white rounded-2xl shadow-sm transition-all flex items-center gap-2 group/ai"
                        >
                          {aiGenerating === `${activeStep}-${i}` ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 group-hover/ai:animate-bounce" />
                              <span className="text-[10px] font-black hidden group-hover/ai:block">سحر ذكي</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-gray-50 p-6 md:p-12 rounded-[3rem] border-2 border-dashed border-gray-200">
                <div className="flex items-center justify-between mb-10 flex-wrap gap-4 text-right">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">مراجعة تقرير Backend Junior</h3>
                  </div>
                  <Button variant="outline" className="gap-2 rounded-2xl" onClick={() => setIsReviewing(false)}>
                    <Edit3 className="w-5 h-5" /> تعديل
                  </Button>
                </div>
                
                <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 prose prose-teal max-w-none dir-rtl text-right">
                  <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center no-pdf">
                     <span className="font-bold text-emerald-800">الدرجة النهائية:</span>
                     <div className="flex flex-col items-end">
                       <span className="text-3xl font-black text-emerald-600">{calculateTotalScore()}%</span>
                       <span className={`text-[10px] font-bold ${calculateTotalScore() >= 75 ? 'text-emerald-500' : calculateTotalScore() >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                         {calculateTotalScore() >= 75 ? 'Ready for Junior Backend' : calculateTotalScore() >= 60 ? 'Needs More Practice' : 'Not Ready Yet'}
                       </span>
                     </div>
                  </div>
                  <textarea 
                    value={finalReport || ''} 
                    onChange={(e) => setFinalReport(e.target.value)}
                    className="w-full min-h-[500px] text-gray-700 font-medium leading-relaxed outline-none border-none resize-none focus:ring-0 text-right"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Interview Mapping */}
          {showQuestions && (
            <div className="w-80 bg-gray-50 border-r border-gray-100 overflow-y-auto p-6 animate-in slide-in-from-left duration-300 text-right">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setShowQuestions(false)} className="text-gray-400 hover:text-red-500 p-1"><X className="w-5 h-5" /></button>
                <h4 className="font-black text-gray-900 flex items-center gap-2">
                   <Coffee className="w-4 h-4 text-accent" /> بنك الأسئلة والمحاور
                </h4>
              </div>

              <div className="space-y-8">
                <section>
                  <h5 className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 border-b border-accent/10 pb-1">1. OOP & Coding (Java/.NET)</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-600 list-disc list-inside">
                    <li>OOP principles مع مثال حي.</li>
                    <li>إزاي بتتعامل مع exceptions؟</li>
                    <li>Interface vs Abstract class.</li>
                    <li>إزاي تقلل code duplication؟</li>
                  </ul>
                </section>

                <section>
                  <h5 className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 border-b border-accent/10 pb-1">2. Problem Solving</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-600 list-disc list-inside">
                    <li>صمم logic لتسجيل مستخدم جديد.</li>
                    <li>التعامل مع invalid input أو nulls.</li>
                    <li>التفكير بصوت عالي أثناء الحل.</li>
                  </ul>
                </section>

                <section>
                  <h5 className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 border-b border-accent/10 pb-1">3. DS & Performance</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-600 list-disc list-inside">
                    <li>Map vs List: متى تختار أيهما؟</li>
                    <li>ArrayList vs LinkedList (Java).</li>
                    <li>تأثير اختيار الـ DS الغلط على الـ Time Complexity.</li>
                  </ul>
                </section>

                <section>
                  <h5 className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 border-b border-accent/10 pb-1">4. API Design</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-600 list-disc list-inside">
                    <li>تصميم REST API للمنتجات.</li>
                    <li>الفروقات بين 400, 401, 403, 500.</li>
                    <li>فائدة الـ Layers (Controller/Service/Repo).</li>
                  </ul>
                </section>
                
                <section>
                  <h5 className="text-[10px] font-black text-accent uppercase tracking-widest mb-3 border-b border-accent/10 pb-1">5. Framework Basics</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-600 list-disc list-inside">
                    <li>Spring Boot Layers (Java).</li>
                    <li>ASP.NET Core Pipeline (.NET).</li>
                    <li>Dependency Injection (DI) وفائدته.</li>
                  </ul>
                </section>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <h6 className="text-[10px] font-black text-amber-900 flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3" /> نصيحة للمحاور
                  </h6>
                  <p className="text-[10px] leading-relaxed text-amber-700 italic">
                    Junior ≠ Senior.
                    قيم الاستقلالية، التفكير المعماري البسيط، والقدرة على التطور.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 md:p-10 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
          <Button variant="outline" onClick={onCancel} className="w-full md:w-auto rounded-2xl">
            إغلاق التقييم
          </Button>
          
          <div className="flex gap-4 w-full md:w-auto">
            {!isReviewing ? (
              <>
                {activeStep > 0 && (
                  <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)} className="flex-1 md:flex-none rounded-2xl">
                    السابق
                  </Button>
                )}
                {activeStep < sections.length - 1 ? (
                  <Button onClick={() => setActiveStep(activeStep + 1)} className="flex-1 md:flex-none rounded-2xl gap-2">
                    التالي 
                  </Button>
                ) : (
                  <Button onClick={handleGenerateReport} disabled={loading} className="flex-1 md:flex-none rounded-2xl gap-3 bg-gradient-to-r from-accent to-emerald-600 border-none shadow-xl shadow-accent/20">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
                    إنتاج تقرير Backend Junior
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={handleFinalSubmit} disabled={loading} className="w-full md:w-auto px-10 rounded-2xl gap-3 shadow-2xl shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700 border-none">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                اعتماد وإرسال للمرشح الآن
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuniorBEEvaluation;
