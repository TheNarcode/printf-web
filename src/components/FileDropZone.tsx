'use client';

import React, { memo, useCallback, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface FileDropZoneProps {
  onFiles: (files: File[]) => void;
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/jpg',
];

const ACCEPTED_EXTS = '.pdf,.doc,.docx,.jpg,.jpeg,.png';

const FileDropZone = memo(({ onFiles }: FileDropZoneProps) => {
  const { colors } = useTheme();
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const valid = Array.from(fileList).filter(f =>
      ACCEPTED_TYPES.includes(f.type) || ACCEPTED_EXTS.split(',').some(ext => f.name.toLowerCase().endsWith(ext.trim().replace('.', '')))
    );
    if (valid.length > 0) onFiles(valid);
  }, [onFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ACCEPTED_EXTS;
    input.multiple = true;
    input.onchange = e => processFiles((e.target as HTMLInputElement).files);
    input.click();
  }, [processFiles]);

  return (
    <button
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="w-full rounded-xl border-2 border-dashed py-10 px-5 flex flex-col items-center gap-2 transition-all cursor-pointer "
      style={{
        borderColor: isDragging ? colors.primary : colors.borderDashed,
        backgroundColor: isDragging ? colors.primaryBg : colors.shimmer,
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-1.5"
        style={{ backgroundColor: colors.primaryBg }}
      >
        <CloudUpload size={24} color={colors.textSecondary} strokeWidth={1.5} />
      </div>
      <span className="text-lg font-bold" style={{ color: colors.text }}>
        {isDragging ? 'Drop files here' : 'Upload files here'}
      </span>
      <span className="text-xs text-center" style={{ color: colors.textMuted }}>
        PDF, JPEG, JPG, PNG supported
      </span>
    </button>
  );
});

FileDropZone.displayName = 'FileDropZone';
export default FileDropZone;
