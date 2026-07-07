'use client';

import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  ChevronLeft, ChevronRight, Minus, Plus, FileText, Info, X, Maximize2,
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import { useAppNav } from '../../app/dashboard/layout';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';
import Header from '../Header';
import Btn from '../Btn';
import type { PrintSettings, UploadedFile } from '../../types';
import { formatFileSize } from '../../utils/formatters';
import {
  parsePageRange, getSheetPages, getTotalSheets, generatePdfThumbnails,
} from '../../utils/previewUtils';
import { useRouter } from 'next/navigation';
import { getStatuses, retryFailed } from '../../services/fileUploadManager';
import { CustomAlertAPI } from '../../context/AlertContext';

const A4_RATIO = 297 / 210;
const SIDES_OPTIONS = [
  { id: 'single',       label: 'Single Sided' },
  { id: 'double-long',  label: 'Double (Long Edge)' },
  { id: 'double-short', label: 'Double (Short Edge)' },
] as const;
const PAGES_PER_SHEET_OPTS = [1, 2, 4, 6, 9];

function CompactSeg({ options, value, onChange, colors }: {
  options: { id: string | number; label: string }[];
  value: string | number;
  onChange: (v: string | number) => void;
  colors: Record<string, string>;
}) {
  return (
    <div className="flex rounded-lg p-0.5" style={{ backgroundColor: colors.surface }}>
      {options.map(opt => {
        const active = value === opt.id;
        return (
          <button key={String(opt.id)} onClick={() => onChange(opt.id)}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              backgroundColor: active ? colors.card : 'transparent',
              color: active ? colors.text : colors.textSecondary,
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            }}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SettingRow({ label, children, colors }: {
  label: string; children: React.ReactNode; colors: Record<string, string>;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 px-3 border-b" style={{ borderColor: colors.borderLight }}>
      <span className="text-sm font-medium flex-shrink-0" style={{ color: colors.text }}>{label}</span>
      <div className="flex-shrink-0 flex justify-end">{children}</div>
    </div>
  );
}

function PreviewSheet({ sheetIndex, selectedPages, pps, thumbnails, thumbLoading, isImage, isBW, file, paperW, paperH }: {
  sheetIndex: number; selectedPages: number[]; pps: number;
  thumbnails: Record<number, string>; thumbLoading: boolean;
  isImage: boolean; isBW: boolean; file: UploadedFile; paperW: number; paperH: number;
}) {
  const pages = getSheetPages(selectedPages, pps, sheetIndex);
  const gridCols = pps <= 2 ? pps : pps <= 4 ? 2 : 3;
  const gridRows = Math.ceil(pps / gridCols);
  return (
    <div className="bg-white shadow-lg flex-shrink-0" style={{
      width: paperW, height: paperH, borderRadius: 2,
      display: 'grid',
      gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
      gridTemplateRows: `repeat(${gridRows}, 1fr)`,
    }}>
      {Array.from({ length: pps }).map((_, cellIdx) => {
        const pageIdx = pages[cellIdx];
        if (pageIdx === undefined) return <div key={`empty-${cellIdx}`} className="bg-gray-50" />;
        const pad = pps > 1 ? 2 : 0;
        const style: React.CSSProperties = { padding: pad, position: 'relative', overflow: 'hidden' };
        if (isImage) {
          return (
            <div key={`img-${cellIdx}`} style={style}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.uri} alt="" className="w-full h-full object-contain" style={{ filter: isBW ? 'grayscale(100%)' : 'none' }} />
            </div>
          );
        }
        const thumbUri = thumbnails[pageIdx];
        if (thumbUri) {
          return (
            <div key={`thumb-${pageIdx}-${cellIdx}`} style={style}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbUri} alt={`Page ${pageIdx + 1}`} className="w-full h-full object-contain" style={{ filter: isBW ? 'grayscale(100%)' : 'none' }} />
            </div>
          );
        }
        return (
          <div key={`loading-${cellIdx}`} style={style} className="flex flex-col items-center justify-center bg-gray-50">
            {thumbLoading
              ? <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
              : <><FileText size={pps > 1 ? 10 : 18} color="#ccc" strokeWidth={1} /><span className="text-[7px] text-gray-300 mt-0.5">Page {pageIdx + 1}</span></>
            }
          </div>
        );
      })}
    </div>
  );
}

export default function PrintSettingsScreen() {
  const { colors } = useTheme();
  const { files, fileSettings, updateFileSettings, resetFlow } = usePrintJob();
  const { push, pop } = useAppNav();
  const { assertOnline } = useNetwork();
  const { getValidToken } = useAuth();
  const router = useRouter();

  // Upload status polling — drives the gatekeeper button
  const [uploadState, setUploadState] = useState<'uploading' | 'done' | 'failed'>('uploading');
  const alertFiredRef = useRef(false);
  const alertHistoryRef = useRef(false);

  useEffect(() => {
    if (files.length === 0) {
      router.replace('/dashboard');
    }
  }, [files.length, router]);

  const [selectedIdx, setSelectedIdx]       = useState(0);
  const [showSidesDropdown, setShowSidesDd] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [pageRangeError, setPageRangeError] = useState('');
  const [thumbnails, setThumbnails]         = useState<Record<number, string>>({});
  const [thumbLoading, setThumbLoading]     = useState(false);
  const [currentSheet, setCurrentSheet]     = useState(0);
  const carouselRef                         = useRef<HTMLDivElement>(null);
  // Tracks whether we pushed a synthetic history entry for the fullscreen overlay.
  // Must call history.back() when closing without popstate to avoid a phantom entry.
  const fullscreenHistoryRef = useRef(false);

  // Poll upload manager every 500ms and gate the Continue button
  useEffect(() => {
    const check = () => {
      const statuses = getStatuses();
      const vals = Object.values(statuses);
      if (vals.length === 0 || vals.every(s => s === 'done')) {
        setUploadState('done');
        alertFiredRef.current = false;
        return;
      }
      if (vals.some(s => s === 'error')) {
        setUploadState('failed');
        return;
      }
      setUploadState('uploading');
    };
    check();
    const timer = setInterval(check, 500);
    return () => clearInterval(timer);
  }, []);

  // Show alert once when uploads fail; re-show if dismissed and user taps button
  const showUploadFailedAlert = useCallback(() => {
    if (alertHistoryRef.current) {
      // Close any synthetic browser history entry pushed for the alert
      alertHistoryRef.current = false;
      window.history.back();
    }
    CustomAlertAPI.alert(
      'Upload Failed',
      'Some files could not be uploaded. Would you like to try again?',
      [
        {
          text: 'Try Later',
          style: 'cancel',
          onPress: () => {
            alertHistoryRef.current = false;
            resetFlow();
            router.replace('/dashboard');
          },
        },
        {
          text: 'Retry',
          onPress: () => {
            alertHistoryRef.current = false;
            if (!assertOnline()) return;
            const uploadableFiles = files
              .filter(f => f.file)
              .map(f => ({ id: f.id, file: f.file!, name: f.name, type: f.type }));
            retryFailed(uploadableFiles, getValidToken);
            setUploadState('uploading');
            alertFiredRef.current = false;
          },
        },
      ],
    );
    // Push a synthetic history entry so browser back closes the alert
    window.history.pushState({ uploadAlert: true }, '');
    alertHistoryRef.current = true;
  }, [files, assertOnline, getValidToken, pop]);

  // Fire alert automatically when state transitions to 'failed' (once per failure)
  useEffect(() => {
    if (uploadState === 'failed' && !alertFiredRef.current) {
      alertFiredRef.current = true;
      showUploadFailedAlert();
    }
  }, [uploadState, showUploadFailedAlert]);

  // Intercept browser back while alert's synthetic entry is present
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      if (alertHistoryRef.current) {
        alertHistoryRef.current = false;
        // Alert was dismissed via back — button remains in error state
        // User can tap the button again to re-show the alert
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Closes fullscreen and pops the synthetic history entry (used by X button & Escape).
  const handleCloseFullscreen = useCallback(() => {
    setShowFullscreen(false);
    if (fullscreenHistoryRef.current) {
      fullscreenHistoryRef.current = false;
      window.history.back();
    }
  }, []);

  // Register keyboard and popstate listeners while fullscreen is open.
  useEffect(() => {
    if (!showFullscreen) return;
    // Push a synthetic entry so the browser back button can dismiss the overlay.
    window.history.pushState({ fullscreen: true }, '');
    fullscreenHistoryRef.current = true;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseFullscreen();
    };
    // popstate fires when the user presses browser back — the entry is already
    // gone so we just close the overlay without calling history.back().
    const onPop = () => {
      fullscreenHistoryRef.current = false;
      setShowFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
    };
  }, [showFullscreen, handleCloseFullscreen]);

  const file     = files[selectedIdx];
  const settings = file ? fileSettings[file.id] : null;
  const isImage  = file?.type.includes('image') ?? false;
  const isPdf    = (file?.type.includes('pdf') || file?.name.toLowerCase().endsWith('.pdf')) ?? false;
  const isBW     = settings?.colorMode === 'bw';

  const update = useCallback(<K extends keyof PrintSettings>(key: K, value: PrintSettings[K]) => {
    if (file) updateFileSettings(file.id, { [key]: value });
  }, [file, updateFileSettings]);

  const handlePageRangeChange = useCallback((text: string) => {
    if (!text || text.trim() === '') { setPageRangeError(''); update('pageRange', 'all'); return; }
    if (!/^[\d\s,\-]+$/.test(text)) { setPageRangeError('Only numbers, dashes, and commas allowed'); update('pageRange', text); return; }
    const parts = text.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.includes('-')) {
        const [a, b] = trimmed.split('-');
        const start = parseInt(a, 10), end = parseInt(b, 10);
        if (isNaN(start) || isNaN(end)) { setPageRangeError('Invalid range numbers'); update('pageRange', text); return; }
        if (start > end) { setPageRangeError(`Invalid range: ${start} > ${end}`); update('pageRange', text); return; }
        if (start < 1 || end > (file?.pages ?? 1)) { setPageRangeError(`Pages 1–${file?.pages ?? 1}`); update('pageRange', text); return; }
      } else {
        const p = parseInt(trimmed, 10);
        if (isNaN(p)) { setPageRangeError('Invalid page number'); update('pageRange', text); return; }
        if (p < 1 || p > (file?.pages ?? 1)) { setPageRangeError(`Page ${p} out of range`); update('pageRange', text); return; }
      }
    }
    setPageRangeError('');
    update('pageRange', text);
  }, [file, update]);

  const selectedPages    = useMemo(() => parsePageRange(settings?.pageRange ?? 'all', file?.pages ?? 1), [settings?.pageRange, file?.pages]);
  const pps              = settings?.pagesPerSheet ?? 1;
  const totalSheets      = getTotalSheets(selectedPages, pps);
  const selectedPagesKey = selectedPages.join(',');
  const sidesLabel       = SIDES_OPTIONS.find(s => s.id === settings?.sides)?.label;
  const isLandscape      = settings?.orientation === 'landscape';
  const paperRatio       = isLandscape ? 1 / A4_RATIO : A4_RATIO;

  useEffect(() => { setCurrentSheet(0); }, [pps, settings?.pageRange, file?.id]);
  useEffect(() => { setPageRangeError(''); }, [file?.id]);

  useEffect(() => {
    if (!isPdf || !file?.file) { setThumbnails({}); return; }
    let cancelled = false;
    setThumbLoading(true);
    setThumbnails({});
    generatePdfThumbnails(file.file, selectedPages)
      .then(result => { if (!cancelled) { setThumbnails(result); setThumbLoading(false); } })
      .catch(() => { if (!cancelled) setThumbLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.id, isPdf, selectedPagesKey]);

  const scrollTo = useCallback((idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: 'smooth' });
    setSelectedIdx(idx);
  }, []);

  const handleCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    if (idx !== selectedIdx) setSelectedIdx(idx);
  }, [selectedIdx]);

  if (!file || !settings) return null;

  const PAPER_W = 300;
  const paperH  = PAPER_W * paperRatio;

  let fsW = 400;
  if (typeof window !== 'undefined') {
    const maxW = window.innerWidth - 64;
    const maxH = window.innerHeight - 160;
    fsW = Math.min(maxW, 520);
    if (fsW * paperRatio > maxH) fsW = maxH / paperRatio;
  }
  const fsPaperW = fsW;
  const fsPaperH = fsPaperW * paperRatio;

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Header title="Print Settings" subtitle="Step 2 of 3" showBack onBack={pop} />

      <main className="flex-1 overflow-y-auto pb-4 relative">

        {/* File Carousel */}
        <div className="page-container-wide px-6 pt-6">
          <div className="flex items-center gap-2">
            <button onClick={() => scrollTo(Math.max(0, selectedIdx - 1))} disabled={selectedIdx === 0 || files.length <= 1}
              className="hidden md:flex flex-shrink-0 w-7 h-7 items-center justify-center rounded-full border shadow-sm transition-all disabled:opacity-20 "
              style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <ChevronLeft size={13} color={colors.text} strokeWidth={2.5} />
            </button>
            <div className="flex-1 min-w-0">
              <div ref={carouselRef} onScroll={handleCarouselScroll} className="flex overflow-x-auto"
                style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
                {files.map((f) => (
                  <div key={f.id} className="shrink-0 w-full pb-3" style={{ scrollSnapAlign: 'start' }}>
                    <div className="flex items-center gap-3 p-3.5 rounded-xl border" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: colors.primaryBg }}>
                        <FileText size={18} color={colors.primary} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate" style={{ color: colors.text }}>{f.name}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: colors.textMuted }}>
                          {formatFileSize(f.size)} · {f.pages} {f.pages === 1 ? 'page' : 'pages'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => scrollTo(Math.min(files.length - 1, selectedIdx + 1))} disabled={selectedIdx === files.length - 1 || files.length <= 1}
              className="hidden md:flex flex-shrink-0 w-7 h-7 items-center justify-center rounded-full border shadow-sm transition-all disabled:opacity-20 "
              style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <ChevronRight size={13} color={colors.text} strokeWidth={2.5} />
            </button>
          </div>
          {files.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 pb-3">
              {files.map((_, i) => (
                <div key={i} className="transition-all duration-300 rounded-full"
                  style={{ width: i === selectedIdx ? 20 : 6, height: 6, backgroundColor: i === selectedIdx ? colors.primary : colors.border }} />
              ))}
            </div>
          )}
        </div>

        {/* Preview + Settings */}
        <div className="page-container-wide px-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:items-stretch">

            {/* Preview */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center justify-between mb-1.5 px-0.5 min-h-[28px]">
                <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: colors.textMuted }}>PRINT PREVIEW</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowFullscreen(true)} className="p-1 transition-opacity ">
                    <Maximize2 size={14} color={colors.textMuted} strokeWidth={2} />
                  </button>
                </div>
              </div>
              <div className="flex-1 rounded-xl border overflow-hidden flex flex-col" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                <div className="flex-1 flex flex-col items-center justify-center py-3 gap-3">
                  <PreviewSheet sheetIndex={currentSheet} selectedPages={selectedPages} pps={pps} thumbnails={thumbnails} thumbLoading={thumbLoading} isImage={isImage} isBW={isBW} file={file} paperW={PAPER_W} paperH={paperH} />
                  <div className="flex items-center gap-3">
                    {totalSheets > 1 && <button onClick={() => setCurrentSheet(s => Math.max(0, s - 1))} disabled={currentSheet === 0} className="p-1.5 rounded transition-opacity disabled:opacity-30 "><ChevronLeft size={16} color={colors.textSecondary} strokeWidth={2} /></button>}
                    <span className="text-[11px]" style={{ color: colors.textMuted }}>
                      {totalSheets > 1 ? `Sheet ${currentSheet + 1} of ${totalSheets} · ` : ''}
                      {selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'}
                    </span>
                    {totalSheets > 1 && <button onClick={() => setCurrentSheet(s => Math.min(totalSheets - 1, s + 1))} disabled={currentSheet === totalSheets - 1} className="p-1.5 rounded transition-opacity disabled:opacity-30 "><ChevronRight size={16} color={colors.textSecondary} strokeWidth={2} /></button>}
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col">
              <div className="flex items-center mb-1.5 px-0.5 min-h-[28px]">
                <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: colors.textMuted }}>OPTIONS</span>
              </div>
              <div className="flex-1 rounded-xl border flex flex-col" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <SettingRow label="Copies" colors={colors}>
                  <div className="flex items-center rounded-md border overflow-hidden" style={{ borderColor: colors.border }}>
                    <button onClick={() => update('copies', Math.max(1, settings.copies - 1))} className="w-8 h-7 flex items-center justify-center "><Minus size={12} color={colors.text} strokeWidth={2} /></button>
                    <div className="w-8 h-7 flex items-center justify-center text-xs font-semibold border-x" style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}>{settings.copies}</div>
                    <button onClick={() => update('copies', settings.copies + 1)} className="w-8 h-7 flex items-center justify-center "><Plus size={12} color={colors.text} strokeWidth={2} /></button>
                  </div>
                </SettingRow>
                <SettingRow label="Color" colors={colors}>
                  <CompactSeg options={[{ id: 'bw', label: 'B&W' }, { id: 'color', label: 'Color' }]} value={settings.colorMode} onChange={v => update('colorMode', v as 'bw' | 'color')} colors={colors} />
                </SettingRow>
                <SettingRow label="Orientation" colors={colors}>
                  <CompactSeg options={[{ id: 'portrait', label: 'Portrait' }, { id: 'landscape', label: 'Landscape' }]} value={settings.orientation} onChange={v => update('orientation', v as 'portrait' | 'landscape')} colors={colors} />
                </SettingRow>
                <SettingRow label="Paper Size" colors={colors}>
                  <CompactSeg options={[{ id: 'a4', label: 'A4' }, { id: 'a3', label: 'A3' }]} value={settings.paperSize} onChange={v => update('paperSize', v as 'a4' | 'a3')} colors={colors} />
                </SettingRow>
                <SettingRow label="Pages / Sheet" colors={colors}>
                  <CompactSeg options={PAGES_PER_SHEET_OPTS.map(n => ({ id: n, label: String(n) }))} value={settings.pagesPerSheet} onChange={v => update('pagesPerSheet', v as number)} colors={colors} />
                </SettingRow>
                <SettingRow label="Sides" colors={colors}>
                  <div className="relative max-w-full">
                    <button onClick={() => setShowSidesDd(s => !s)}
                      className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-md border text-xs font-medium  transition-opacity"
                      style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}>
                      <span className="truncate">{sidesLabel}</span>
                      <ChevronRight size={12} color={colors.textMuted} strokeWidth={2} className={`transition-transform flex-shrink-0 ${showSidesDropdown ? 'rotate-90' : ''}`} />
                    </button>
                    {showSidesDropdown && (
                      <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border shadow-lg overflow-hidden min-w-[150px]" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                        {SIDES_OPTIONS.map(opt => (
                          <button key={opt.id} onClick={() => { update('sides', opt.id); setShowSidesDd(false); }} className="w-full px-3 py-2 text-xs text-left "
                            style={{ backgroundColor: settings.sides === opt.id ? colors.primaryBg : 'transparent', color: settings.sides === opt.id ? colors.primary : colors.text, fontWeight: settings.sides === opt.id ? 600 : 400 }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </SettingRow>
                <div className="flex-1 px-4 py-3.5 border-t" style={{ borderColor: colors.borderLight }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: colors.text }}>Page Range</span>
                    <span className="text-xs" style={{ color: colors.textMuted }}>{file.pages} pages total</span>
                  </div>
                  <input type="text" className="w-full px-3 py-2.5 rounded-md border text-xs outline-none"
                    style={{ backgroundColor: colors.surface, borderColor: pageRangeError ? colors.danger : colors.border, color: colors.text }}
                    placeholder="All pages — or enter range like 1-5, 8, 11-13"
                    value={settings.pageRange === 'all' ? '' : settings.pageRange}
                    onChange={e => handlePageRangeChange(e.target.value)} />
                  {pageRangeError && <p className="text-xs mt-1 font-medium" style={{ color: colors.danger }}>{pageRangeError}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="flex-shrink-0 px-6 py-4 border-t z-30" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="page-container-wide">
          <Btn
            variant="solid"
            size="lg"
            fullWidth
            onClick={() => {
              if (uploadState === 'failed') { showUploadFailedAlert(); return; }
              if (!assertOnline()) return;
              push({ id: 'payment', transition: 'push' });
            }}
            disabled={!!pageRangeError || uploadState === 'uploading'}
            loading={uploadState === 'uploading'}
          >
            {uploadState === 'uploading' ? 'Uploading…' : 'Proceed to Payment'}
          </Btn>
        </div>
      </div>

      {/* Fullscreen preview modal */}
      {showFullscreen && (
        <div className="absolute inset-0 z-[9999] flex flex-col animate-fade-in" style={{ backgroundColor: colors.background }}>
          <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: colors.border }}>
            <span className="text-sm font-semibold" style={{ color: colors.text }}>Print Preview</span>
            <button onClick={handleCloseFullscreen} className="p-2 "><X size={18} color={colors.textMuted} strokeWidth={2} /></button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <PreviewSheet sheetIndex={currentSheet} selectedPages={selectedPages} pps={pps} thumbnails={thumbnails} thumbLoading={thumbLoading} isImage={isImage} isBW={isBW} file={file} paperW={fsPaperW} paperH={fsPaperH} />
            <div className="flex items-center gap-3">
              {totalSheets > 1 && <button onClick={() => setCurrentSheet(s => Math.max(0, s - 1))} disabled={currentSheet === 0} className="p-2 rounded-lg border disabled:opacity-30" style={{ borderColor: colors.border }}><ChevronLeft size={16} color={colors.textSecondary} /></button>}
              <span className="text-sm" style={{ color: colors.textMuted }}>
                {totalSheets > 1 ? `Sheet ${currentSheet + 1} of ${totalSheets} · ` : ''}
                {selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'}
              </span>
              {totalSheets > 1 && <button onClick={() => setCurrentSheet(s => Math.min(totalSheets - 1, s + 1))} disabled={currentSheet === totalSheets - 1} className="p-2 rounded-lg border disabled:opacity-30" style={{ borderColor: colors.border }}><ChevronRight size={16} color={colors.textSecondary} /></button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
