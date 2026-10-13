import React, { useState, useRef } from 'react';
import { copyTagIdToClipboard } from '@ecare24/utils';

interface UiBadgeProps {
  serialId: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  itemName?: string;
  pageName?: string;
}

export const UiBadge: React.FC<UiBadgeProps> = ({
  serialId,
  children,
  className = '',
  style = {},
  label,
  itemName,
  pageName,
}) => {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyTagIdToClipboard(serialId, {
      itemName,
      pageName,
      label,
      targetElement: containerRef.current,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      ref={containerRef}
      data-serial-id={serialId}
      data-item-name={itemName}
      data-page-name={pageName}
      data-testid={serialId}
      className={`relative inline-block ${className}`}
      style={{ position: 'relative', ...style }}
    >
      <span
        className={`ui-serial-badge ${copied ? 'copied' : ''}`}
        data-serial-id={serialId}
        onClick={handleClick}
        title="클릭/터치 시 일련번호, 페이지명, URI, 항목명이 복사됩니다"
      >
        {copied ? 'Copied! ✓' : label || serialId}
      </span>
      {children}
    </div>
  );
};

export default UiBadge;
