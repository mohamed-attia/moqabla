
import React, { useState, useEffect } from 'react';
import { Key, AlertCircle, ExternalLink } from 'lucide-react';
import Button from './Button';

interface ApiKeySelectorProps {
  onKeySelected?: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const checkKey = async () => {
    try {
      // @ts-ignore - window.aistudio is pre-configured in this environment
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      setHasKey(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleOpenSelect = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success per instructions to mitigate race conditions
      setHasKey(true);
      if (onKeySelected) onKeySelected();
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  if (loading) return null;
  if (hasKey) return null;

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
          <Key className="w-6 h-6" />
        </div>
        <div className="flex-grow">
          <h4 className="text-lg font-black text-amber-900 mb-1">تنشيط محرك الذكاء الاصطناعي</h4>
          <p className="text-amber-700 text-sm mb-4 leading-relaxed">
            لاستخدام ميزات التقييم الذكي، يجب عليك اختيار مفتاح API صالح من مشروع GCP مفعل به الدفع (Billing).
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleOpenSelect}
              className="bg-amber-600 hover:bg-amber-700 text-white border-none py-2 px-6 rounded-xl text-xs font-black shadow-lg shadow-amber-200"
            >
              اختيار مفتاح API
            </Button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 underline underline-offset-4"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              تعرف على متطلبات الدفع
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelector;
