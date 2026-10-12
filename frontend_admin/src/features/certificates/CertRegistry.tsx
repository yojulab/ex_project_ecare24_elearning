import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Modal, notification } from 'antd';
import { Award, Download, CheckCircle, AlertTriangle, QrCode, Search } from 'lucide-react';
import { MOCK_CUSTOMER_PROFILES } from '@ecare24/utils';
import { Certificate } from '@ecare24/types';
import UiBadge from '../../components/UiBadge';

export const CertRegistry: React.FC = () => {
  const allCerts: Certificate[] = MOCK_CUSTOMER_PROFILES.flatMap((c) => c.certificates);
  const [certs] = useState<Certificate[]>(allCerts);
  const [search, setSearch] = useState('');

  const handleExportExcel = () => {
    notification.success({
      message: '📥 [직능원 보고용] 자격증 발급대장 엑셀 다운로드',
      description: '한국직업능력연구원(pqi.or.kr) 제출 규격 서식으로 ecare24_cert_registry_2026.xlsx가 추출되었습니다.',
    });
  };

  const filtered = certs.filter(
    (c) =>
      c.userName.includes(search) ||
      c.certificateNo.includes(search) ||
      c.qualificationName.includes(search)
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      <UiBadge serialId="P24-SEC01-CRD01" label="[P24-SEC01-CRD01]" className="w-full">
        <Card
          size="small"
          title="민간자격증 발급 대장 및 직능원(pqi.or.kr) 보고용 관리 센터"
          extra={
            <div className="flex items-center gap-2">
              <Input
                size="small"
                prefix={<Search className="w-3 h-3 text-slate-400" />}
                placeholder="수검자명 / 등록번호 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56"
              />
              <Button
                type="primary"
                size="small"
                icon={<Download className="w-3 h-3" />}
                onClick={handleExportExcel}
                className="bg-emerald-600 hover:bg-emerald-500 font-bold"
              >
                직능원 보고용 엑셀 추출
              </Button>
            </div>
          }
          className="shadow-sm border-slate-200"
          styles={{ header: { background: '#f8fafc', fontWeight: 800 } }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2.5">자격등록번호</th>
                  <th className="p-2.5">종목 및 자격명칭</th>
                  <th className="p-2.5">성명 (생년월일)</th>
                  <th className="p-2.5">취득점수</th>
                  <th className="p-2.5">발급일 / 유효기간</th>
                  <th className="p-2.5">상태 / 공적검증</th>
                  <th className="p-2.5">2D QR 검증 토큰</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-indigo-700">
                      {cert.certificateNo}
                    </td>
                    <td className="p-2.5 font-bold text-slate-800">
                      {cert.qualificationName} ({cert.grade})
                    </td>
                    <td className="p-2.5 text-slate-700 font-semibold">
                      {cert.userName} ({cert.birthDate})
                    </td>
                    <td className="p-2.5 text-emerald-600 font-extrabold">{cert.score}점</td>
                    <td className="p-2.5 text-slate-500 text-[11px]">
                      {cert.issuedAt} ~ {cert.expiryDate}
                    </td>
                    <td className="p-2.5">
                      {cert.status === 'VALID' ? (
                        <Tag color="success" className="font-bold flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> 정상 인증
                        </Tag>
                      ) : (
                        <Tag color="warning" className="font-bold flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> 보수교육 갱신
                        </Tag>
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-400">
                      {cert.qrVerifyToken.slice(0, 18)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </UiBadge>
    </div>
  );
};

export default CertRegistry;
