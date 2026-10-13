import React from 'react';
import { UiBadge } from '../components/UiBadge';
import { ShieldCheck, Clock, ChevronRight, Stethoscope, AlertCircle, ArrowRight } from 'lucide-react';

interface CurriculumScreenProps {
  onSelectCourse?: (diseaseId: number) => void;
}

export const CurriculumScreen: React.FC<CurriculumScreenProps> = ({ onSelectCourse }) => {
  const steps = [
    { num: '01', title: '수강 신청', desc: '희망 16대 트랙 선택 및 접수', badge: '온라인 접수' },
    { num: '02', title: '이론 교육 (4h)', desc: '질환별 임상 병태생리 & 골든룰', badge: '모바일 이어보기' },
    { num: '03', title: '실기 훈련 (4h)', desc: '피딩/석션/체변 시뮬레이션', badge: '총 8시간 이수' },
    { num: '04', title: '간호사 실습평가', desc: '임상간호사 1:1 심사 (70점 이상)', badge: '필수 합격제' },
    { num: '05', title: '자격증 발급', desc: '한국직업능력연구원 민간자격 등록', badge: '공식 배지 발급' },
  ];

  const tracks = [
    { id: 1, name: '치매(알츠하이머) 전문돌봄사', code: 'TRK-01', rule: '탈건착환 및 인지안정화' },
    { id: 2, name: '뇌졸중(중풍·편마비) 전문돌봄사', code: 'TRK-02', rule: '건측 중심 휠체어 이승' },
    { id: 3, name: '파킨슨병 일상동작 전문돌봄사', code: 'TRK-03', rule: '보행동결 시각단서 유도' },
    { id: 4, name: '와상환자 욕창예방 전문돌봄사', code: 'TRK-04', rule: '2시간 주기 체변(q2hr) 엄수' },
    { id: 5, name: '연하곤란 경관영양 전문돌봄사', code: 'TRK-05', rule: 'L-tube 피딩 상체 30도 거치' },
    { id: 6, name: '석션·기관절개관 전문돌봄사', code: 'TRK-06', rule: '1회 흡인 15초 이내 제한' },
    { id: 7, name: '요루·장루·유린백 전문돌봄사', code: 'TRK-07', rule: '소변백 방광보다 하단 거치' },
    { id: 8, name: '당뇨·당뇨발 괴사예방 전문돌봄사', code: 'TRK-08', rule: '저혈당 대처 및 일자 발톱' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-6">
      {/* 상단 타이틀 */}
      <div className="bg-white p-5 border-b border-slate-200">
        <UiBadge serialId="P40-CURR-TTL01">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
              程
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              교육 체계 (16대 트랙)
            </h1>
          </div>
        </UiBadge>
        <p className="text-xs text-slate-500 mt-1">
          질환별 각 총 8시간(이론 4h + 실기 4h) 이수 및 간호사 실습평가 체계
        </p>
      </div>

      <div className="p-4 space-y-5">
        {/* ==================================================================
            수강 신청과 수료 절차 다이어그램
            ================================================================== */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <UiBadge serialId="P40-CURR-SEC01">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900">
                수강 신청 및 수료 절차도
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                5단계 표준 절차
              </span>
            </div>
          </UiBadge>

          {/* 5단계 카드 플로우 */}
          <div className="space-y-2 pt-1">
            {steps.map((st, idx) => (
              <div
                key={st.num}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    {st.num}
                  </span>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">
                      {st.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {st.desc}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0">
                  {st.badge}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed mt-2 flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <b>신청 조건:</b> 본원 이론 수료자 또는 보건복지부 요양보호사 자격증 보유자 + 지정 간호사 실습평가서(70점 이상) 통과 필수
            </span>
          </div>
        </div>

        {/* ==================================================================
            16대 자격 트랙 목록 (각 8시간)
            ================================================================== */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <UiBadge serialId="P40-CURR-SEC02">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900">
                16대 전문 돌봄 자격 트랙 (각 8h)
              </h2>
              <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                이론 4h + 실기 4h
              </span>
            </div>
          </UiBadge>

          <div className="space-y-2">
            {tracks.map((trk) => (
              <button
                key={trk.id}
                onClick={() => onSelectCourse?.(trk.id)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      {trk.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      {trk.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    골든룰: {trk.rule}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CurriculumScreen;
