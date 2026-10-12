import React, { useState } from 'react';
import { UiBadge } from './UiBadge';
import { ShieldCheck, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface GoldenRuleCardProps {
  id: number;
  title: string;
  desc: string;
  badCase: string;
  index: number;
}

export const GoldenRuleCard: React.FC<GoldenRuleCardProps> = ({
  id,
  title,
  desc,
  badCase,
  index,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <UiBadge serialId={`P41-RULE-CRD${String(id).padStart(2, '0')}`} className="w-full">
      <div
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              #{id}
            </span>
            <h4 className="text-sm font-black text-slate-900 leading-tight">
              {title}
            </h4>
          </div>
          <button className="text-slate-400 p-1">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        <p className="mt-2 text-xs font-bold text-slate-700 leading-relaxed">
          {desc}
        </p>

        {expanded && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
            <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-black uppercase text-rose-900">
                  현장 절대 금기 / 주의 사례
                </span>
                <p className="text-xs font-bold text-rose-700 mt-0.5">
                  {badCase}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </UiBadge>
  );
};
export default GoldenRuleCard;
