import React, { useState } from 'react';
import { UiBadge } from '../components/UiBadge';
import { ENV } from '../config/env';
import {
  Award,
  QrCode,
  Download,
  Share2,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building,
} from 'lucide-react';

export const WalletCertScreen: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  const [certData, setCertData] = useState({
    regNumber: '제 2026-00892 호',
    pqiRegId: '보건복지부 직능원 등록 제2026-0892호',
    title: '신경계 전문간병사 1급',
    diseaseName: '신경계(뇌졸중/편마비) 질환군 집중 케어',
    holderName: '김 영 희',
    birthDate: '1975. 06. 12',
    issueDate: '2026년 10월 19일',
    organization: '한국돌봄종사자양성교육원',
    verifyUrl: `${ENV.API_BASE_URL.replace('/api/v1', '')}/verify?cert=EC24-CERT-2026-00892`,
  });

  React.useEffect(() => {
    const fetchLiveCert = async () => {
      try {
        const loginRes = await fetch(`${ENV.API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loginId: 'student01', password: 'password123!' }),
        });
        if (!loginRes.ok) return;
        const { accessToken } = await loginRes.json();

        const certRes = await fetch(`${ENV.API_BASE_URL}/me/certificates`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (certRes.ok) {
          const data = await certRes.json();
          if (data.certificates && data.certificates.length > 0) {
            const first = data.certificates[0];
            setCertData({
              regNumber: first.certificateNo,
              pqiRegId: `직능원 등록 ${first.registryNo}`,
              title: first.qualificationName,
              diseaseName: first.course?.targetDisease || '16대 표준 질환군 전문 케어',
              holderName: '김 영 희',
              birthDate: '1975. 06. 12',
              issueDate: first.issuedAt?.slice(0, 10) || '2026-10-19',
              organization: '한국돌봄종사자양성교육원',
              verifyUrl: `${ENV.API_BASE_URL.replace('/api/v1', '')}/verify?cert=${first.certificateNo}`,
            });
            setIsDbLoaded(true);
          }
        }
      } catch {
        // Fallback 유지
      }
    };
    fetchLiveCert();
  }, []);

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => setWalletAdded(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-slate-900 text-white">
      {/* Top Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
            모바일 자격증 지갑
          </span>
          <h1 className="text-base font-black text-white leading-tight">
            공인 민간자격증 디지털 인증서
          </h1>
        </div>
        <span className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
          <Award size={20} />
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* SEC01: Luxury Metallic Certificate Wallet Card */}
        <UiBadge serialId="P45-SEC01-CARD" className="w-full">
          <div className="relative rounded-3xl p-6 bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 text-slate-950 shadow-[0_15px_30px_rgba(245,158,11,0.25)] border border-yellow-200 overflow-hidden">
            {/* Background Watermark Stamp */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border-8 border-yellow-900/10 flex items-center justify-center pointer-events-none rotate-12">
              <span className="text-4xl opacity-15 font-black">eCare24</span>
            </div>

            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-950 text-amber-300 font-black flex items-center justify-center text-xs shadow">
                  eC
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-950/70 block leading-none">
                    대한민국 민간자격증
                  </span>
                  <span className="text-xs font-black text-slate-950 leading-tight">
                    {certData.regNumber}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full shadow-sm">
                정식 발급 완료
              </span>
            </div>

            {/* Cert Title & Disease */}
            <div className="mt-4">
              <span className="text-[11px] font-black text-amber-950">
                {certData.diseaseName}
              </span>
              <h2 className="text-xl font-black text-slate-950 tracking-tight leading-tight mt-0.5">
                {certData.title}
              </h2>
            </div>

            {/* Holder details */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-amber-600/20 p-3 rounded-2xl border border-amber-700/20">
              <div>
                <span className="text-[10px] font-bold text-amber-950/80 block">성 명</span>
                <span className="text-sm font-black text-slate-950">{certData.holderName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-950/80 block">생년월일</span>
                <span className="text-sm font-black text-slate-950">{certData.birthDate}</span>
              </div>
            </div>

            {/* Issue date & Issuing Authority */}
            <div className="mt-4 flex items-center justify-between text-[11px] text-amber-950 font-extrabold border-t border-amber-900/20 pt-3">
              <div>
                <span className="block text-[9px] opacity-80">발급일자</span>
                <span>{certData.issueDate}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] opacity-80">발행기관</span>
                <span className="font-black">사단법인 한국전문간병협회</span>
              </div>
            </div>
          </div>
        </UiBadge>

        {/* SEC02: QR Code Instant Verification Card */}
        <UiBadge serialId="P45-SEC02-QR" className="w-full">
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow">
                {/* Simulated QR Pattern */}
                <div className="w-full h-full bg-slate-950 rounded flex flex-col justify-between p-1">
                  <div className="flex justify-between">
                    <span className="w-2 h-2 bg-white" />
                    <span className="w-2 h-2 bg-white" />
                  </div>
                  <div className="flex justify-center">
                    <span className="w-1.5 h-1.5 bg-blue-400" />
                  </div>
                  <div className="flex justify-between">
                    <span className="w-2 h-2 bg-white" />
                    <span className="w-2 h-2 bg-white" />
                  </div>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-400 uppercase">
                  실시간 위변조 진위확인
                </span>
                <h3 className="text-xs font-black text-white mt-0.5">
                  직능원(pqi.or.kr) 연계 QR 검증
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  병원 또는 보호자가 카메라로 스캔 시 즉시 진위 인증
                </p>
              </div>
            </div>
            <a
              href={ENV.CERT_VERIFY_URL}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-700 text-slate-200 hover:text-white"
              title="공개 진위확인 웹페이지 열기"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </UiBadge>

        {/* SEC03: Actions (PDF Download, Apple/Google Wallet) */}
        <div className="space-y-2.5 pt-1">
          <UiBadge serialId="P45-SEC03-DOWNLOAD" className="w-full">
            <button
              onClick={handleDownloadPdf}
              className={`w-full min-h-[50px] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
              }`}
            >
              <Download size={16} />
              <span>
                {downloadSuccess
                  ? 'PDF 공식 인증서 다운로드 완료 ✓'
                  : '고해상도 PDF 공식 자격증 출력 다운로드'}
              </span>
            </button>
          </UiBadge>

          <UiBadge serialId="P45-SEC03-WALLET" className="w-full">
            <button
              onClick={handleAddToWallet}
              className={`w-full min-h-[50px] py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 border transition-all ${
                walletAdded
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 active:scale-95'
              }`}
            >
              <CreditCard size={16} />
              <span>
                {walletAdded
                  ? 'Apple / Google Wallet에 등록되었습니다 ✓'
                  : '스마트폰 기본 지갑 (Apple / Google Wallet)에 추가'}
              </span>
            </button>
          </UiBadge>
        </div>

        {/* Regulatory Information Footer */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-center gap-1 text-slate-300 font-bold mb-1">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>민간자격 표시 의무 고지사항</span>
          </div>
          • 자격명: 신경계 전문간병사 1급 (등록번호: 2026-004821)<br />
          • 발급기관: 사단법인 한국전문간병협회 / (주)이케어24<br />
          • 상기 자격은 자격기본법 규정에 따라 등록된 민간자격으로, 국가공인 자격이 아닙니다.
        </div>
      </div>
    </div>
  );
};
export default WalletCertScreen;
