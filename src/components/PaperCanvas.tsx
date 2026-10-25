import { HandwritingStyleConfig, PageLayout, PaperConfig, PaperType, StudentProject, ViewMode } from '@/types';
import { createPaperConfig } from '@/lib/paper-templates';
import { renderPageToCanvas } from '@/lib/renderer';
import {
  ChevronLeft,
  ChevronRight,
  Columns,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Grid,
  Hand,
  Layers,
  Maximize2,
  Music,
  PenTool,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Isolated subcomponent to guarantee render on mount, prop change, and font load
const SingleCanvasView: React.FC<{
  page: PageLayout;
  paperConfig: PaperConfig;
  handwritingConfig: HandwritingStyleConfig;
  studentMeta?: StudentProject['studentMeta'];
  onCanvasMounted?: (canvas: HTMLCanvasElement) => void;
}> = ({ page, paperConfig, handwritingConfig, studentMeta, onCanvasMounted }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onMountRef = useRef(onCanvasMounted);
  onMountRef.current = onCanvasMounted;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderPageToCanvas(canvas, page, paperConfig, handwritingConfig, studentMeta);
    onMountRef.current?.(canvas);

    // Re-paint when Google Fonts load to ensure cursive handwriting is crisp
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        if (canvasRef.current) {
          renderPageToCanvas(canvasRef.current, page, paperConfig, handwritingConfig, studentMeta);
        }
      });
    }
  }, [page, paperConfig, handwritingConfig, studentMeta]);

  return (
    <div className="bg-white rounded-sm shadow-2xl overflow-hidden border border-slate-300 pointer-events-none select-none">
      <canvas ref={canvasRef} className="block pointer-events-none" />
    </div>
  );
};

interface PaperCanvasProps {
  pages: PageLayout[];
  paperConfig: PaperConfig;
  onUpdatePaperConfig?: (config: PaperConfig) => void;
  handwritingConfig: HandwritingStyleConfig;
  studentMeta: StudentProject['studentMeta'];
  onRegisterCanvases: (canvases: HTMLCanvasElement[]) => void;
}

export const PaperCanvas: React.FC<PaperCanvasProps> = ({
  pages,
  paperConfig,
  onUpdatePaperConfig,
  handwritingConfig,
  studentMeta,
  onRegisterCanvases,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [zoom, setZoom] = useState(0.85); // 85% scale fits comfortably on desktop

  // Free Pan & Drag cursor state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const canvasMapRef = useRef<Map<number, HTMLCanvasElement>>(new Map());

  const registerCanvas = (pageIndex: number, canvas: HTMLCanvasElement) => {
    canvasMapRef.current.set(pageIndex, canvas);
    const list: HTMLCanvasElement[] = [];
    for (let i = 0; i < pages.length; i++) {
      const c = canvasMapRef.current.get(i);
      if (c) list.push(c);
    }
    onRegisterCanvases(list);
  };

  // Mouse drag handlers for free cursor movement
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left mouse click only
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(0.85);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - (viewMode === 'double' ? 2 : 1)));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + (viewMode === 'double' ? 2 : 1)));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* Top Preview Controls Bar */}
      <div className="h-11 bg-white/90 backdrop-blur-xs border-b border-slate-200 px-4 flex items-center justify-between z-10 select-none">
        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'single' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'hover:text-slate-900'
            }`}
            title="Satu Halaman"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1 Halaman</span>
          </button>
          <button
            onClick={() => setViewMode('double')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'double' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'hover:text-slate-900'
            }`}
            title="Dua Halaman Berdampingan (Buku Terbuka)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2 Halaman (Buku)</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'grid' ? 'bg-white text-indigo-600 font-semibold shadow-xs' : 'hover:text-slate-900'
            }`}
            title="Semua Halaman"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Semua</span>
          </button>
        </div>

        {/* Page Navigation (Single / Double mode) */}
        {viewMode !== 'grid' && (
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-700">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              {viewMode === 'double'
                ? `Halaman ${currentPage + 1}-${Math.min(currentPage + 2, pages.length)} dari ${pages.length}`
                : `Halaman ${currentPage + 1} dari ${pages.length}`}
            </span>
            <button
              onClick={handleNextPage}
              disabled={viewMode === 'double' ? currentPage >= pages.length - 2 : currentPage >= pages.length - 1}
              className="p-1 rounded hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Drag Pan Indicator & Zoom Controls */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
          <div
            className="hidden lg:flex items-center space-x-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200"
            title="Tekan & geser mouse untuk menggeser posisi kertas"
          >
            <Hand className="w-3 h-3 text-indigo-600" />
            <span>Geser Bebas Aktif</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setZoom((prev) => Math.max(0.35, prev - 0.1))}
              className="p-1 hover:bg-slate-100 rounded"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono font-semibold">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((prev) => Math.min(1.8, prev + 0.1))}
              className="p-1 hover:bg-slate-100 rounded"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1 hover:bg-slate-100 rounded ml-1 text-slate-600 flex items-center space-x-1"
              title="Reset Posisi & Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Paper Carousel Bar (Pelajar, Mahasiswa, Guru, Dosen) */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center space-x-1.5 overflow-x-auto text-[11px] select-none scrollbar-none shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Kertas Cepat:
        </span>

        {[
          { id: 'ruled' as PaperType, label: 'Buku SIDU', icon: FileText, desc: 'Sekolah' },
          { id: 'folio' as PaperType, label: 'Double Folio', icon: FileText, desc: 'Tugas Kuliah/PR' },
          { id: 'looseleaf' as PaperType, label: 'Loose Leaf', icon: Layers, desc: 'Binder Mahasiswa' },
          { id: 'grid' as PaperType, label: 'Kotak Matematika', icon: Grid, desc: '5mm Sains' },
          { id: 'grid-large' as PaperType, label: 'Kotak Besar', icon: Grid, desc: '10mm Aksara' },
          { id: 'lined-3' as PaperType, label: 'Garis 3 Halus', icon: PenTool, desc: 'Tegak Bersambung' },
          { id: 'exam' as PaperType, label: 'Lembar Ujian', icon: FileCheck, desc: 'Resmi UTS/UAS' },
          { id: 'millimeter' as PaperType, label: 'Milimeter Blok', icon: FileSpreadsheet, desc: 'Grafik Teknik' },
          { id: 'music' as PaperType, label: 'Not Balok', icon: Music, desc: 'Stave Musik' },
          { id: 'plain' as PaperType, label: 'Polos Ivory', icon: FileText, desc: 'HVS Bebas' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onUpdatePaperConfig && onUpdatePaperConfig(createPaperConfig(item.id, paperConfig.size || 'A4'))}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all shrink-0 font-medium ${
              paperConfig.type === item.id
                ? 'bg-indigo-600 text-white font-semibold shadow-xs ring-1 ring-indigo-500'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
            title={`${item.label} (${item.desc})`}
          >
            <item.icon className="w-3 h-3" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Interactive Free-Drag Pan Viewport */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 overflow-hidden p-8 flex items-center justify-center select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          style={{
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 120ms ease-out',
            transformOrigin: 'center center',
          }}
          className="will-change-transform"
        >
          {viewMode === 'single' && (
            <div>
              {pages.map((page, idx) => (
                <div
                  key={`single-${page.pageNumber}`}
                  className={idx === currentPage ? 'block' : 'hidden'}
                >
                  <SingleCanvasView
                    page={page}
                    paperConfig={paperConfig}
                    handwritingConfig={handwritingConfig}
                    studentMeta={studentMeta}
                    onCanvasMounted={(c) => registerCanvas(idx, c)}
                  />
                </div>
              ))}
            </div>
          )}

          {viewMode === 'double' && (
            <div className="flex items-center shadow-2xl rounded-lg overflow-hidden border border-slate-300 bg-white">
              {/* Left Page */}
              {pages[currentPage] && (
                <div className="relative border-r border-slate-300">
                  <SingleCanvasView
                    page={pages[currentPage]}
                    paperConfig={paperConfig}
                    handwritingConfig={handwritingConfig}
                    studentMeta={studentMeta}
                    onCanvasMounted={(c) => registerCanvas(currentPage, c)}
                  />
                  {/* Notebook Center Spine Shadow */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                </div>
              )}

              {/* Right Page */}
              {pages[currentPage + 1] ? (
                <div className="relative">
                  <SingleCanvasView
                    page={pages[currentPage + 1]}
                    paperConfig={paperConfig}
                    handwritingConfig={handwritingConfig}
                    studentMeta={studentMeta}
                    onCanvasMounted={(c) => registerCanvas(currentPage + 1, c)}
                  />
                  {/* Notebook Center Spine Shadow */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                </div>
              ) : (
                // Empty right side if odd number of pages
                <div
                  className="bg-slate-50 flex items-center justify-center text-slate-300 text-sm font-medium"
                  style={{
                    width: pages[0]?.width || 798,
                    height: pages[0]?.height || 1128,
                  }}
                >
                  Halaman Kosong
                </div>
              )}
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="flex flex-col space-y-12 items-center">
              {pages.map((page, idx) => (
                <div key={`grid-${page.pageNumber}`}>
                  <SingleCanvasView
                    page={page}
                    paperConfig={paperConfig}
                    handwritingConfig={handwritingConfig}
                    studentMeta={studentMeta}
                    onCanvasMounted={(c) => registerCanvas(idx, c)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
