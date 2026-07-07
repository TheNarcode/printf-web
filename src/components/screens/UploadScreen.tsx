'use client';

import React, { useCallback, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import { useAppNav } from '../../app/dashboard/layout';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import Header from '../Header';
import FileDropZone from '../FileDropZone';
import FileCard from '../FileCard';
import Btn from '../Btn';
import type { UploadedFile } from '../../types';
import { generateId, formatFileSize } from '../../utils/formatters';
import { getPdfPageCount } from '../../utils/previewUtils';
import { startUploads } from '../../services/fileUploadManager';
import { CustomAlertAPI } from '../../context/AlertContext';

export default function UploadScreen() {
  const { colors } = useTheme();
  const { files, addFiles, removeFile, resetFlow } = usePrintJob();
  const { getValidToken } = useAuth();
  const { push, pop } = useAppNav();
  const { assertOnline } = useNetwork();
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(async (rawFiles: File[]) => {
    setProcessing(true);
    try {
      const uploaded: UploadedFile[] = [];
      const skippedNames: string[] = [];
      for (const raw of rawFiles) {
        const isDuplicate = files.some(f => f.name === raw.name && f.size === raw.size) ||
                            uploaded.some(f => f.name === raw.name && f.size === raw.size);
        if (isDuplicate) {
          skippedNames.push(raw.name);
          continue;
        }

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
      if (uploaded.length > 0) addFiles(uploaded);
      if (skippedNames.length > 0) {
        CustomAlertAPI.alert(
          'Duplicate Files Skipped',
          `The following files were already added:\n${skippedNames.join(', ')}`
        );
      }
    } finally {
      setProcessing(false);
    }
  }, [addFiles, files]);

  const handleBack = useCallback(() => {
    resetFlow();
    pop();
  }, [resetFlow, pop]);

  const handleContinue = useCallback(() => {
    if (!assertOnline()) return;
    const uploadableFiles = files.map(f => ({ id: f.id, file: f.file!, name: f.name, type: f.type })).filter(f => f.file);
    startUploads(uploadableFiles, getValidToken);
    push({ id: 'print_settings', transition: 'push' });
  }, [files, getValidToken, push, assertOnline]);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Header title="Upload Files" subtitle="Step 1 of 3" showBack onBack={handleBack} />

      <main className="flex-1 overflow-y-auto pb-8 flex flex-col">
        <div className={`page-container px-6 pt-6 flex-1 flex flex-col ${files.length === 0 ? 'justify-center pb-20' : ''}`}>

          <FileDropZone onFiles={handleFiles} />

          {processing && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-xl" style={{ backgroundColor: colors.primaryBg }}>
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.primary }} />
              <span className="text-sm" style={{ color: colors.primary }}>Reading files…</span>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-7 flex flex-col gap-3">

              {files.map(f => (
                <FileCard key={f.id} file={f} onRemove={removeFile} />
              ))}
            </div>
          )}
        </div>
      </main>

      {files.length > 0 && (
        <div className="flex-shrink-0 px-6 py-5 border-t z-30" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <div className="page-container flex flex-col items-center">
            <span className="text-[13px] font-medium mb-3" style={{ color: colors.textMuted }}>
              {files.length} {files.length === 1 ? 'file' : 'files'} selected ({formatFileSize(files.reduce((s, f) => s + f.size, 0))})
            </span>
            <Btn variant="solid" size="lg" fullWidth onClick={handleContinue} disabled={processing} style={{ backgroundColor: colors.text, color: colors.background, borderColor: colors.text }}>
              Continue
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
