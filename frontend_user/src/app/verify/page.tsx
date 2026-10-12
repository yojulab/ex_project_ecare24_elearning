'use client';

import React, { useState } from 'react';
import {
  Award,
  Search,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Building,
  Calendar,
  User,
} from 'lucide-react';
import { MOCK_CUSTOMER_PROFILES } from '@ecare24/utils';
import { Certificate } from '@ecare24/types';
import UiBadge from '../../components/UiBadge';

export default function CertVerifyPage() {
  const [inputNo, setInputNo] = useState('EC24-2026-NEURO-00084');
  const [searchedCert, setSearchedCert] = useState<Certificate | null>(
    MOCK_CUSTOMER_PROFILES[0].certificates[0] || null
  );
  const [searched, setSearched] = useState(true);

  const handleSearch = () => {
    const allCerts = MOCK_CUSTOMER_PROFILES.flatMap((c) => c.certificates);
    const found = allCerts.find(
      (c) =>
        c.certificateNo.toUpperCase() === inputNo.trim().toUpperCase() ||
        c.qrVerifyToken === inputNo.trim()
    );
    setSearchedCert(found || null);
    setSearched(true);
  };

  return (
    <div
      data-serial-id="P09-SEC01-VERIFY"
      className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-10"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>공적 2D QR 코드 위·변조 방지 진위확인 시스템</span>
        </div>
        <UiBadge serialId="P09-SEC01-TIT01" label="[P09-SEC01-TIT01]">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            환자질환별전문간병사 자격 진위 확인
          </h1>
        </UiBadge>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          병원, 요양원, 환자 보호자께서 간병인의 자격증 등록번호 또는 모바일 QR 코드를 조회하여
          공적 진위를 실시간 검증할 수 있습니다.
        </p>
      </div>

      {/* 검색창 */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <UiBadge serialId="P09-SEC01-INP01" label="[P09-SEC01-INP01]" className="flex-1">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 w-full">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={inputNo}
              onChange={(e) => setInputNo(e.target.value)}
              placeholder="자격등록번호 입력 (예: EC24-2026-NEURO-00084)"
              className="bg-transparent w-full outline-none text-sm font-mono font-bold text-slate-800 placeholder-slate-400"
            />
          </div>
        </UiBadge>

        <UiBadge serialId="P09-SEC01-BTN01" label="[P09-SEC01-BTN01]">
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-8 py-3 rounded-2xl text-sm transition shadow shrink-0"
          >
            진위 조회하기
          </button>
        </UiBadge>
      </div>

      {/* 검증 결과 카드 */}
      {searched && searchedCert && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-400 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ 공적 등록 검증 완료
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {searchedCert.qualificationName} ({searchedCert.grade})
                </h3>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 font-mono">자격등록번호</span>
              <div className="text-sm font-mono font-bold text-indigo-700">
                {searchedCert.certificateNo}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-indigo-500" /> 간병사 성명 (개인정보 보호)
              </span>
              <div className="font-extrabold text-slate-800 text-base">
                {searchedCert.userName[0]}*{searchedCert.userName.slice(2)} (
                {searchedCert.birthDate.slice(0, 4)}.**.**)
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Building className="w-4 h-4 text-indigo-500" /> 등록 주무부처 및 기관
              </span>
              <div className="font-extrabold text-slate-800 text-base">
                보건복지부 / 직능원 제2026-0812호
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-indigo-500" /> 최초 취득일자
              </span>
              <div className="font-mono font-extrabold text-slate-800 text-base">
                {searchedCert.issuedAt}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-indigo-500" /> 유효기간 및 보수교육 주기
              </span>
              <div className="font-mono font-extrabold text-emerald-700 text-base">
                {searchedCert.expiryDate}까지 유효 (2년 주기)
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-sans">
            본 자격증은 자격기본법 제17조 제2항에 따라 한국직업능력연구원에 정식 등록된
            민간자격증이며, ecare24 시스템의 블록체인/HMAC 해시 검증 토큰과 100% 일치함이
            확인되었습니다.
          </div>
        </div>
      )}

      {searched && !searchedCert && (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-800">
            일치하는 자격증 정보를 찾을 수 없습니다.
          </h3>
          <p className="text-xs text-slate-500">
            입력하신 자격등록번호({inputNo})를 다시 한 번 확인해 주시거나 콜센터(1588-2424)로 문의 바랍니다.
          </p>
        </div>
      )}
    </div>
  );
}
