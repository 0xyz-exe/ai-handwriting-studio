import { HandwritingStyleConfig, PageLayout, PaperConfig, StudentProject, ViewMode } from '@/types';
import { renderPageToCanvas } from '@/lib/renderer';
import { ChevronLeft, ChevronRight, Columns, Eye, Grid, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface PaperCanvasProps {
  pages: PageLayout[];
  paperConfig: PaperConfig;
  handwritingConfig: HandwritingStyleConfig;
  studentMeta: StudentProject['studentMeta'];
  onRegisterCanvases: (canvases: HTMLCanvasElement[]) => void;
}

export const PaperCanvas: React.FC<PaperCanvasProps> = ({
  pages,
  paperConfig,
  handwritingConfig,
  studentMeta,
  onRegisterCanvases,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [zoom, setZoom] = useState(0.85); // 85% scale fits comfortably on desktop

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  // Keep canvas refs length matching pages length
  useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, pages.length);
  }, [pages.length]);

  // Render canvases whenever pages, paperConfig, handwritingConfig, or studentMeta change
  useEffect(() => {
    const activeCanvases: HTMLCanvasElement[] = [];

    pages.forEach((page, index) => {
      const canvas = canvasRefs.current[index];
      if (canvas) {
        renderPageToCanvas(canvas, page, paperConfig, handwritingConfig, studentMeta);
        activeCanvases.push(canvas);
      }
    });

    onRegisterCanvases(activeCanvases);
  }, [pages, paperConfig, handwritingConfig, studentMeta, onRegisterCanvases]);

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

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-600">
          <button
            onClick={() => setZoom((prev) => Math.max(0.4, prev - 0.1))}
            className="p-1 hover:bg-slate-100 rounded"
            title="Perkecil"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((prev) => Math.min(1.5, prev + 0.1))}
            className="p-1 hover:bg-slate-100 rounded"
            title="Perbesar"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(0.85)}
            className="p-1 hover:bg-slate-100 rounded ml-1"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        {viewMode === 'single' && (
          <div
            className="transition-transform duration-150 origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {pages.map((page, idx) => (
              <div
                key={page.pageNumber}
                className={idx === currentPage ? 'block' : 'hidden'}
              >
                <div className="bg-white rounded shadow-2xl overflow-hidden border border-slate-300">
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[idx] = el;
                    }}
                    className="block"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'double' && (
          <div
            className="transition-transform duration-150 origin-center flex items-center shadow-2xl rounded-lg overflow-hidden border border-slate-300 bg-white"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Left Page */}
            {pages[currentPage] && (
              <div className="relative border-r border-slate-300">
                <canvas
                  ref={(el) => {
                    canvasRefs.current[currentPage] = el;
                  }}
                  className="block"
                />
                {/* Notebook Center Spine Shadow */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />
              </div>
            )}

            {/* Right Page */}
            {pages[currentPage + 1] ? (
              <div className="relative">
                <canvas
                  ref={(el) => {
                    canvasRefs.current[currentPage + 1] = el;
                  }}
                  className="block"
                />
                {/* Notebook Center Spine Shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />
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
          <div
            className="flex flex-col space-y-12 transition-transform duration-150 origin-top items-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {pages.map((page, idx) => (
              <div
                key={page.pageNumber}
                className="bg-white rounded shadow-2xl overflow-hidden border border-slate-300"
              >
                <canvas
                  ref={(el) => {
                    canvasRefs.current[idx] = el;
                  }}
                  className="block"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
