import React, { useState } from 'react';
import { UiBadge } from '../components/UiBadge';
import { Building2, HeartHandshake, Users, MapPin, ExternalLink, ShieldCheck, CheckCircle2, Phone } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const [subTab, setSubTab] = useState<'intro' | 'greeting' | 'org' | 'map' | 'sites'>('intro');

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-6">
      {/* 상단 타이틀 배너 */}
      <div className="bg-white p-5 border-b border-slate-200">
        <UiBadge serialId="P40-ABOUT-TTL01">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
              院
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              교육원 소개
            </h1>
          </div>
        </UiBadge>
        <p className="text-xs text-slate-500 mt-1">
          한국돌봄종사자양성교육원 공식 안내 (ecarecti)
        </p>

        {/* 5대 하위 메뉴 탭바 */}
        <div className="grid grid-cols-5 gap-1 mt-4 pt-3 border-t border-slate-100">
          {[
            { id: 'intro', label: '소개', icon: Building2 },
            { id: 'greeting', label: '인사말', icon: HeartHandshake },
            { id: 'org', label: '조직도', icon: Users },
            { id: 'map', label: '오시는길', icon: MapPin },
            { id: 'sites', label: '관련기관', icon: ExternalLink },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = subTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id as any)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition ${
                  isSel
                    ? 'bg-emerald-700 text-white font-extrabold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold'
                }`}
              >
                <Icon size={16} />
                <span className="text-[11px] mt-1">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 내용 영역 */}
      <div className="p-4 space-y-4">
        {subTab === 'intro' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <UiBadge serialId="P40-ABOUT-SEC01">
              <h2 className="text-base font-black text-slate-900">교육원 설립 취지 및 비전</h2>
            </UiBadge>
            <p className="text-xs text-slate-600 leading-relaxed">
              본 교육원은 요양보호사 선생님들과 돌봄 종사자의 전문성을 극대화하기 위해, 
              보건복지부 요양보호 표준과 대학병원 임상 전문 간호를 연계한 <b>16대 질환별 전문 돌봄 자격 트랙(각 총 8시간)</b>을 제공하는 전문 교육기관입니다.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
              • 16대 질환별 맞춤 이론 4h + 실기 4h<br />
              • 대학병원 표준 임상 돌봄지침서 연계<br />
              • 간호사 실습평가서 70점 이상 통과제
            </div>
          </div>
        )}

        {subTab === 'greeting' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <UiBadge serialId="P40-ABOUT-SEC02">
              <h2 className="text-base font-black text-slate-900">대표인사말</h2>
            </UiBadge>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "환자의 존엄성을 지키고, 가족의 간병 부담을 덜어주는 믿음직한 전문 돌봄 인재를 양성하겠습니다."
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              현장에서 요구하는 전문 의료 술기 보조(피딩, 석션, 욕창 케어)를 체계적으로 습득하여, 자부심 넘치는 전문 돌봄인으로 거듭나시길 응원합니다.
            </p>
            <div className="text-right text-xs font-bold text-slate-800 pt-2 border-t border-slate-100">
              한국돌봄종사자양성교육원 원장 배상
            </div>
          </div>
        )}

        {subTab === 'org' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <UiBadge serialId="P40-ABOUT-SEC03">
              <h2 className="text-base font-black text-slate-900">조직 안내</h2>
            </UiBadge>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-extrabold text-emerald-800 block">교무기획팀</span>
                16대 질환 커리큘럼 개발, 전문 교수진 위촉
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-extrabold text-blue-800 block">교육운영팀</span>
                모바일 앱/LMS 학습관리, 모의고사 CBT 시스템 운영
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-extrabold text-purple-800 block">임상실습지원팀</span>
                협력병원 실습 배정, 임상간호사 실습평가서 심사
              </div>
            </div>
          </div>
        )}

        {subTab === 'map' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <UiBadge serialId="P40-ABOUT-SEC04">
              <h2 className="text-base font-black text-slate-900">오시는 길</h2>
            </UiBadge>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>주소:</b> 서울특별시 영등포구 영등포로 150, 이케어교육빌딩 4층</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><b>문의:</b> 1588-2424 (평일 09:00 ~ 18:00)</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                • 5호선 영등포시장역 4번 출구 도보 3분<br />
                • 건물 지하 주차장 2시간 무료 지원
              </p>
            </div>
          </div>
        )}

        {subTab === 'sites' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <UiBadge serialId="P40-ABOUT-SEC05">
              <h2 className="text-base font-black text-slate-900">관련 사이트</h2>
            </UiBadge>
            <div className="space-y-2 text-xs">
              <a
                href="http://www.ecarecti.co.kr"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 block"
              >
                <div className="font-extrabold text-emerald-800">이케어 평생교육원 (ecarecti) ↗</div>
                <div className="text-[11px] text-slate-500 mt-0.5">돌봄종사자 직무 보수교육 포털</div>
              </a>
              <a
                href="https://www.pqi.or.kr"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 block"
              >
                <div className="font-extrabold text-blue-800">한국직업능력연구원 (pqi.or.kr) ↗</div>
                <div className="text-[11px] text-slate-500 mt-0.5">민간자격정보서비스 등록조회</div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AboutScreen;
