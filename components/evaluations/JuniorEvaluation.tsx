
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, ChevronLeft, ChevronRight, Star, Sparkles, 
  Loader2, Trophy, Brain, Target, MessageSquare, Save, Eye, Edit3,
  X, AlertTriangle, ArrowRight, Zap, Award
} from 'lucide-react';
import Button from '../Button';
import { AIAgent } from '../../lib/ai-agent';
import { FRESH_EVALUATION_TEMPLATE, JUNIOR_EVALUATION_TEMPLATE } from '../../lib/evaluation-templates';
import { EvaluationSection, EvaluationScore } from '../../types';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

interface Props {
  registration: any;
  onComplete: () => void;
  onCancel: () => void;
}

const JuniorEvaluation: React.FC<Props> = ({ registration, onComplete, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  
  // Choose template based on candidate level
  const template = registration.level === 'junior' ? JUNIOR_EVALUATION_TEMPLATE : FRESH_EVALUATION_TEMPLATE;
  const [sections, setSections] = useState<EvaluationSection[]>(JSON.parse(JSON.stringify(template)));

  const scoreLabels = ['Not Demonstrated', 'Basic Awareness', 'Developing', 'Competent', 'Strong for Level'];
  
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
    
    const suggestion = await AIAgent.suggestNote(
        item.skill, 
        item.score, 
        registration.level === 'junior' ? 'Junior Level' : 'Fresh Level'
    );
    updateNote(sectionIdx, itemIdx, suggestion);
    setAiGenerating(null);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    const totalScore = calculateTotalScore();
    const interviewerName = auth.currentUser?.displayName || "المقيم";
    
    const report = await AIAgent.generateFinalReport(
      registration.fullName,
      interviewerName,
      registration.level === 'junior' ? 'Junior Software Engineer' : 'Fresh Software Engineer',
      { 
        sections: sections.map(s => ({
          title: s.title,
          score: `${Math.round(s.items.reduce((sum, i) => sum + i.score, 0) / (s.items.length * 5) * s.weight)}/${s.weight}`,
          items: s.items.map(i => ({ skill: i.skill, score: i.score, notes: i.notes }))
        })),
        totalScore: `${totalScore}/100`
      }
    );

    if (report) {
      setFinalReport(report);
      setIsReviewing(true);
    }
    setLoading(false);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const regRef = doc(db, "registrations", registration.id);
      await updateDoc(regRef, {
        status: 'completed',
        evaluationReport: finalReport,
        finalScore: calculateTotalScore(),
        completedAt: serverTimestamp()
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
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl md:h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Dynamic Header with Gamified Score */}
        <div className="bg-primary p-6 md:p-10 text-white relative shrink-0 border-b-4 border-accent">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-teal-400 rounded-3xl flex items-center justify-center shadow-lg shadow-accent/40 animate-pulse">
                <Brain className="w-9 h-9" />
              </div>
              <div className="text-right">
                <h2 className="text-xl md:text-2xl font-black">{registration.fullName}</h2>
                <div className="flex items-center gap-2 text-accent/90 text-sm font-bold mt-1">
                  <Award className="w-4 h-4" />
                  <span className="uppercase tracking-widest">{registration.level} Assessment Flow</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="text-center">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Section</div>
                <div className="text-xl font-black text-accent">{activeStep + 1} / {sections.length}</div>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <div className="text-center">
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Live Score</div>
                <div className={`text-3xl font-black transition-all duration-500 ${totalScore >= 75 ? 'text-emerald-400' : totalScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {totalScore}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-accent shadow-[0_0_20px_rgba(13,148,136,0.6)] transition-all duration-1000 ease-out"
              style={{ width: `${((activeStep + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Body */}
        {!isReviewing ? (
          <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-12">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-accent shadow-inner">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">{currentSection.title}</h3>
              </div>
              <div className="text-[10px] font-black bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20">
                WEIGHT: {currentSection.weight}%
              </div>
            </div>

            <div className="space-y-16">
              {currentSection.items.map((item, i) => (
                <div key={i} className="group/item animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                    <div className="space-y-2 flex-grow">
                      <label className="text-xl font-bold text-gray-900 flex items-center gap-4">
                        <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs shadow-md group-hover/item:bg-accent transition-colors">
                          {i + 1}
                        </span>
                        {item.skill}
                      </label>
                      <p className="text-sm text-gray-400 mr-12 leading-relaxed">
                        Evaluate the candidate's depth and practical application of {item.skill.toLowerCase()} for the {registration.level} level.
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 shrink-0 justify-end">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateScore(activeStep, i, s as EvaluationScore)}
                          className={`
                            group/btn relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all transform hover:scale-110 active:scale-95
                            ${item.score === s 
                              ? s >= 4 ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-100' :
                                s === 3 ? 'bg-amber-500 border-amber-400 text-white shadow-xl shadow-amber-100' :
                                'bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-100'
                              : 'bg-white border-gray-100 text-gray-400 hover:border-accent/40 hover:bg-accent/5'
                            }
                          `}
                        >
                          <span className="text-xl font-black leading-none">{s}</span>
                          <span className="text-[7px] font-black mt-1 opacity-0 group-hover/btn:opacity-100 transition-opacity absolute -bottom-6 bg-gray-800 text-white px-2 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none">
                            {scoreLabels[s - 1]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative mr-12 group/note">
                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gray-100 rounded-full group-focus-within/note:bg-accent transition-colors"></div>
                    <textarea
                      value={item.notes}
                      onChange={(e) => updateNote(activeStep, i, e.target.value)}
                      placeholder="أضف ملاحظاتك هنا أو دع الذكاء الاصطناعي يقترح عليك..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-3xl p-6 pr-6 pl-16 text-sm focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none min-h-[120px] transition-all"
                    />
                    <button 
                      onClick={() => handleAiSuggest(activeStep, i)}
                      disabled={aiGenerating === `${activeStep}-${i}`}
                      className="absolute left-4 bottom-4 p-3 bg-white border border-gray-200 text-accent hover:bg-accent hover:text-white rounded-2xl shadow-md transition-all flex items-center gap-2 group/ai active:scale-90"
                      title="AI Magic Notes"
                    >
                      {aiGenerating === `${activeStep}-${i}` ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 group-hover/ai:rotate-12" />
                          <span className="text-[10px] font-black hidden lg:block">سحر ذكي</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar">
            <div className="bg-gray-50 p-6 md:p-12 rounded-[4rem] border-4 border-dashed border-gray-200 relative">
              <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-100">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-800">مراجعة التقرير الذكي</h3>
                    <p className="text-gray-400 text-sm font-bold">يمكنك التعديل يدوياً قبل الاعتماد النهائي</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsReviewing(false)} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-black text-gray-600 hover:bg-gray-100 transition-all">
                    <Edit3 className="w-5 h-5" /> تعديل المدخلات
                  </button>
                </div>
              </div>
              
              <div id="final-report-preview" className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 prose prose-teal max-w-none dir-rtl text-right">
                <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center no-pdf">
                   <span className="font-bold text-emerald-800">الدرجة النهائية للمرشح:</span>
                   <span className="text-3xl font-black text-emerald-600">{calculateTotalScore()}%</span>
                </div>
                <textarea 
                  value={finalReport || ''} 
                  onChange={(e) => setFinalReport(e.target.value)}
                  className="w-full min-h-[600px] text-gray-700 font-medium leading-relaxed outline-none border-none resize-none focus:ring-0 custom-scrollbar"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="p-6 md:p-10 border-t border-gray-100 bg-gray-50/80 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
          <button onClick={onCancel} className="text-gray-400 hover:text-rose-500 font-black text-sm flex items-center gap-2 transition-colors">
             <X className="w-5 h-5" /> إلغاء التقييم والخروج
          </button>
          
          <div className="flex gap-4 w-full md:w-auto">
            {!isReviewing ? (
              <>
                {activeStep > 0 && (
                  <Button variant="outline" onClick={() => setActiveStep(activeStep - 1)} className="flex-1 md:flex-none rounded-2xl px-10">
                    السابق
                  </Button>
                )}
                {activeStep < sections.length - 1 ? (
                  <Button onClick={() => setActiveStep(activeStep + 1)} className="flex-1 md:flex-none rounded-2xl px-12 gap-3 group">
                     التالي 
                  </Button>
                ) : (
                  <Button onClick={handleGenerateReport} disabled={loading} className="flex-1 md:flex-none rounded-2xl px-12 gap-3 bg-gradient-to-r from-accent to-emerald-600 border-none shadow-2xl shadow-accent/30">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    إنتاج التقرير النهائي للمرشح
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={handleFinalSubmit} disabled={loading} className="w-full md:w-auto px-16 py-5 rounded-[2rem] gap-4 shadow-2xl shadow-emerald-300 bg-emerald-600 hover:bg-emerald-700 border-none text-xl">
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

export default JuniorEvaluation;
