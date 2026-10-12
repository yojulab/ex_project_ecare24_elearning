import React, { useState } from 'react';
import { copyTagIdToClipboard } from '@ecare24/utils';

interface UiBadgeProps {
  serialId: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export const UiBadge: React.FC<UiBadgeProps> = ({
  serialId,
  children,
  className = '',
  style = {},
  label,
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyTagIdToClipboard(serialId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      data-serial-id={serialId}
      data-testid={serialId}
      className={`relative inline-block ${className}`}
      style={{ position: 'relative', ...style }}
    >
      <span
        className={`ui-serial-badge ${copied ? 'copied' : ''}`}
        data-serial-id={serialId}
        onClick={handleClick}
        title="클릭/터치 시 의뢰자 피드백용 ID가 복사됩니다"
      >
        {copied ? 'Copied! ✓' : label || serialId}
      </span>
      {children}
    </div>
  );
};

export default UiBadge;
