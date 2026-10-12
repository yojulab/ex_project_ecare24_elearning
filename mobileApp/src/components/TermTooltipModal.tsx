import React from 'react';
import { CaregiverTerm } from '@ecare24/types';
import { UiBadge } from './UiBadge';
import { X, AlertTriangle, ShieldCheck, BookOpen } from 'lucide-react';

interface TermTooltipModalProps {
  term: CaregiverTerm | null;
  onClose: () => void;
}

export const TermTooltipModal: React.FC<TermTooltipModalProps> = ({
  term,
  onClose,
}) => {
  if (!term) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <BookOpen size={18} />
            </span>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                간병 임상 전문 용어
              </span>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {term.term}
                {term.standardTerm && term.standardTerm !== term.term && (
                  <span className="ml-1.5 text-sm font-semibold text-slate-500">
                    ({term.standardTerm})
                  </span>
                )}
              </h3>
            </div>
          </div>
          <UiBadge serialId="P47-MODAL-CLOSE">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </UiBadge>
        </div>

        {/* Category & Badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            분야: {term.category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            10대 골든 룰 연계 항목
          </span>
        </div>

        {/* Definition */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase">정의 및 현장 설명</h4>
          <p className="mt-1 text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {term.definition}
          </p>
        </div>

        {/* Golden Rule / Clinical Points */}
        {term.carePoint && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-amber-800 font-black text-sm">
              <ShieldCheck size={16} />
              <span>현장 간병 포인트 (Care Point)</span>
            </div>
            <p className="mt-1 text-xs font-bold text-amber-900 leading-relaxed">
              {term.carePoint}
            </p>
          </div>
        )}

        {/* Warning Alert notice */}
        {term.warningAlert && (
          <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-rose-800 font-black text-sm">
              <AlertTriangle size={16} />
              <span>주의사항 및 레드플래그</span>
            </div>
            <p className="mt-1 text-xs font-bold text-rose-700">
              {term.warningAlert}
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-5">
          <UiBadge serialId="P47-MODAL-CONFIRM" className="w-full">
            <button
              onClick={onClose}
              className="w-full min-h-[50px] py-3 rounded-xl bg-blue-600 text-white font-black text-base shadow hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              확인 및 학습 계속하기
            </button>
          </UiBadge>
        </div>
      </div>
    </div>
  );
};
export default TermTooltipModal;
