'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

const API_BASE = 'http://localhost:30013/api/v1';

export const PopupLayer: React.FC = () => {
  const [popups, setPopups] = useState<any[]>([]);
  const [closedIds, setClosedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const res = await fetch(`${API_BASE}/popups/active?channel=web`);
        if (res.ok) {
          const list = await res.json();
          // 로컬스토리지에서 오늘 숨긴 팝업 ID 필터링
          const hiddenDate = localStorage.getItem('ecare24_hide_popups_until');
          const isTodayHidden = hiddenDate && new Date(hiddenDate) > new Date();

          if (!isTodayHidden && list.length > 0) {
            setPopups(list);
          }
        }
      } catch (e) {
        // 백엔드 미기동 시 무시
      }
    };

    fetchPopups();
  }, []);

  const handleClose = (id: string, hideToday?: boolean) => {
    setClosedIds((prev) => [...prev, id]);
    if (hideToday) {
      const tomorrow = new Date();
      tomorrow.setHours(23, 59, 59, 999);
      localStorage.setItem('ecare24_hide_popups_until', tomorrow.toISOString());
    }
  };

  const activePopups = popups.filter((p) => !closedIds.includes(p.id));
  if (activePopups.length === 0) return null;

  const current = activePopups[0]; // 가장 우선순위 높은 팝업

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-sm">교육원 알림 공지</span>
          </div>
          <button
            onClick={() => handleClose(current.id)}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">{current.title}</h3>

          {current.contentHtml && (
            <div
              className="text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: current.contentHtml }}
            />
          )}

          {current.linkUrl && (
            <a
              href={current.linkUrl}
              onClick={() => handleClose(current.id)}
              className="flex items-center justify-center gap-1.5 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <span>자세히 보기 및 수강신청 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <button
            onClick={() => handleClose(current.id, true)}
            className="hover:text-slate-800 underline font-medium"
          >
            오늘 하루 보지 않기
          </button>
          <button
            onClick={() => handleClose(current.id)}
            className="font-bold text-slate-700 hover:text-slate-900"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
