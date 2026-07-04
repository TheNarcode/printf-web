'use client';

import React, { useCallback, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import { useAppNav } from '../../app/dashboard/layout';
import { useAuth } from '../../context/AuthContext';
import Header from '../Header';
import FileDropZone from '../FileDropZone';
import FileCard from '../FileCard';
import Btn from '../Btn';
import type { UploadedFile } from '../../types';
import { generateId, formatFileSize } from '../../utils/formatters';
import { getPdfPageCount } from '../../utils/previewUtils';
import { startUploads } from '../../services/fileUploadManager';

export default function UploadScreen() {
  const { colors } = useTheme();
  const { files, addFiles, removeFile, resetFlow } = usePrintJob();
  const { getValidToken } = useAuth();
  const { push, pop } = useAppNav();
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(async (rawFiles: File[]) => {
    setProcessing(true);
    try {
      const uploaded: UploadedFile[] = [];
      for (const raw of rawFiles) {
        let pages = 1;
        if (raw.type === 'application/pdf') pages = await getPdfPageCount(raw);
        uploaded.push({
          id: generateId(),
          name: raw.name,
          uri: URL.createObjectURL(raw),
          file: raw,
          size: raw.size,
          type: raw.type,
          pages,
        });
      }
      addFiles(uploaded);
    } finally {
      setProcessing(false);
    }
  }, [addFiles]);

  const handleBack = useCallback(() => {
    resetFlow();
    pop();
  }, [resetFlow, pop]);

  const handleContinue = useCallback(() => {
    const uploadableFiles = files.map(f => ({ id: f.id, file: f.file!, name: f.name, type: f.type })).filter(f => f.file);
    startUploads(uploadableFiles, getValidToken);
    push({ id: 'settings', transition: 'push' });
  }, [files, getValidToken, push]);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Header title="Upload Files" subtitle="Step 1 of 3" showBack onBack={handleBack} />

      <main className="flex-1 overflow-y-auto pb-8">
        <div className="page-container px-5 pt-4">

          <FileDropZone onFiles={handleFiles} />

          {processing && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-xl" style={{ backgroundColor: colors.primaryBg }}>
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.primary }} />
              <span className="text-sm" style={{ color: colors.primary }}>Reading files…</span>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-7 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold" style={{ color: colors.text }}>
                  Selected files ({files.length})
                </h2>
                <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
                  {formatFileSize(files.reduce((s, f) => s + f.size, 0))} total
                </span>
              </div>
              {files.map(file => (
                <FileCard key={file.id} file={file} onRemove={removeFile} />
              ))}
            </div>
          )}
        </div>
      </main>

      {files.length > 0 && (
        <div className="flex-shrink-0 px-6 py-5 border-t" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="page-container">
            <Btn variant="solid" size="lg" fullWidth onClick={handleContinue} disabled={processing}>
              Continue to Settings
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
