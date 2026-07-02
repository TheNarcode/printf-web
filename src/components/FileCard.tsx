'use client';

import React, { memo, useCallback } from 'react';
import { FileText, Image as ImageIcon, X } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import type { UploadedFile } from '../types';
import { formatFileSize, getFileExtLabel, getFileTypeColor } from '../utils/formatters';

interface FileCardProps {
  file: UploadedFile;
  onRemove?: (id: string) => void;
}

const FileCard = memo(({ file, onRemove }: FileCardProps) => {
  const { colors } = useTheme();
  const ext = getFileExtLabel(file.name);
  const fileColor = getFileTypeColor(file.name);
  const isImage = file.type.includes('image');
  const Icon = isImage ? ImageIcon : FileText;

  const handleRemove = useCallback(() => onRemove?.(file.id), [file.id, onRemove]);

  return (
    <div
      className="flex items-center gap-2.5 p-3 rounded-xl border transition-all"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: fileColor + '15' }}
      >
        <Icon size={18} color={fileColor} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-sm font-semibold truncate" style={{ color: colors.text }}>{file.name}</span>
        <span className="text-[11px]" style={{ color: colors.textMuted }}>
          {ext} · {formatFileSize(file.size)} · {file.pages} {file.pages === 1 ? 'page' : 'pages'}
        </span>
      </div>

      {onRemove && (
        <button
          onClick={handleRemove}
          className="p-1.5 rounded-lg transition-opacity hover:opacity-70 flex-shrink-0"
          aria-label={`Remove ${file.name}`}
        >
          <X size={14} color={colors.textMuted} strokeWidth={2} />
        </button>
      )}
    </div>
  );
});

FileCard.displayName = 'FileCard';
export default FileCard;
