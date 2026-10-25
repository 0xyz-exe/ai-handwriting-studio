import { PenType } from '@/types';
import {
  Code,
  Divide,
  Heading1,
  Heading2,
  Highlighter,
  List,
  PenLine,
  Pencil,
  SplitSquareVertical,
} from 'lucide-react';
import React, { useRef } from 'react';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  activePen: PenType;
  onSelectPen: (pen: PenType) => void;
  totalPages: number;
  totalLines: number;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  activePen,
  onSelectPen,
  totalPages,
  totalLines,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelectionWithTag = (openTag: string, closeTag: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = content.substring(start, end);

    const replacement = `${openTag}${selectedText || 'teks'}${closeTag}`;
    const nextContent = content.substring(0, start) + replacement + content.substring(end);

    onChange(nextContent);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + openTag.length, start + openTag.length + (selectedText.length || 4));
    }, 10);
  };

  const insertLinePrefix = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const before = content.substring(0, start);
    const after = content.substring(start);

    // Find start of current line
    const lastNewline = before.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const nextContent = content.substring(0, lineStart) + prefix + content.substring(lineStart);
    onChange(nextContent);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 10);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full bg-white lg:border-r border-slate-200">
      {/* Multi-Pen Selection Bar */}
      <div className="p-2 sm:p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Alat Tulis:
        </span>

        <button
          onClick={() => {
            onSelectPen('ballpoint-blue');
            wrapSelectionWithTag('[blue]', '[/blue]');
          }}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            activePen === 'ballpoint-blue'
              ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400 font-semibold shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Bolpoin Biru untuk Judul / Header"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-xs" />
          <span>Pena Biru</span>
        </button>

        <button
          onClick={() => {
            onSelectPen('ballpoint-black');
            wrapSelectionWithTag('[black]', '[/black]');
          }}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            activePen === 'ballpoint-black'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Bolpoin Hitam untuk Isi Catatan"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-black inline-block" />
          <span>Pena Hitam</span>
        </button>

        <button
          onClick={() => {
            onSelectPen('ballpoint-red');
            wrapSelectionWithTag('[red]', '[/red]');
          }}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            activePen === 'ballpoint-red'
              ? 'bg-red-100 text-red-700 ring-1 ring-red-400 font-semibold shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Bolpoin Merah untuk Poin Penting / Koreksi"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shadow-xs" />
          <span>Pena Merah</span>
        </button>

        <button
          onClick={() => {
            onSelectPen('ballpoint-green');
            wrapSelectionWithTag('[green]', '[/green]');
          }}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all font-medium ${
            activePen === 'ballpoint-green'
              ? 'bg-green-100 text-green-700 ring-1 ring-green-400 font-semibold shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Bolpoin Hijau untuk Sub-poin"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block shadow-xs" />
          <span>Pena Hijau</span>
        </button>

        <button
          onClick={() => {
            onSelectPen('pencil');
            wrapSelectionWithTag('[pencil]', '[/pencil]');
          }}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all font-medium ${
            activePen === 'pencil'
              ? 'bg-slate-200 text-slate-900 ring-1 ring-slate-400 font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Pensil 2B Standar (Ujian & Sketsa)"
        >
          <Pencil className="w-3 h-3 text-slate-600" />
          <span>Pensil 2B</span>
        </button>

        <button
          onClick={() => {
            onSelectPen('pencil-mechanical');
            wrapSelectionWithTag('[pencil-mech]', '[/pencil-mech]');
          }}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all font-medium ${
            activePen === 'pencil-mechanical'
              ? 'bg-slate-200 text-slate-900 ring-1 ring-slate-400 font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Pensil Mekanik 0.5mm (Garis Tipis Presisi)"
        >
          <Pencil className="w-3 h-3 text-slate-700" />
          <span>Mekanik 0.5</span>
        </button>

        <button
          onClick={() => {
            onSelectPen('pencil-4b');
            wrapSelectionWithTag('[pencil-4b]', '[/pencil-4b]');
          }}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all font-medium ${
            activePen === 'pencil-4b'
              ? 'bg-slate-300 text-slate-950 ring-1 ring-slate-500 font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Pensil 4B Gelap (Goresan Tebal Bertekstur)"
        >
          <Pencil className="w-3 h-3 text-slate-900" />
          <span>Pensil 4B</span>
        </button>

        <button
          onClick={() => {
            onSelectPen('pencil-colored-red');
            wrapSelectionWithTag('[pencil-red]', '[/pencil-red]');
          }}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all font-medium ${
            activePen === 'pencil-colored-red'
              ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-400 font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Pensil Warna Merah"
        >
          <Pencil className="w-3 h-3 text-rose-600" />
          <span>Pensil Merah</span>
        </button>

        <button
          onClick={() => {
            onSelectPen('pencil-colored-blue');
            wrapSelectionWithTag('[pencil-blue]', '[/pencil-blue]');
          }}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all font-medium ${
            activePen === 'pencil-colored-blue'
              ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-400 font-semibold'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title="Pensil Warna Biru"
        >
          <Pencil className="w-3 h-3 text-blue-600" />
          <span>Pensil Biru</span>
        </button>

        <button
          onClick={() => wrapSelectionWithTag('[hl]', '[/hl]')}
          className="flex items-center space-x-1 px-2.5 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md border border-yellow-300 font-medium transition-all"
          title="Stabilo Kuning"
        >
          <Highlighter className="w-3 h-3 text-yellow-700" />
          <span>Stabilo</span>
        </button>
      </div>

      {/* Formatting Toolbar */}
      <div className="px-3 py-1.5 bg-white border-b border-slate-200 flex items-center space-x-1 text-slate-600 text-xs overflow-x-auto">
        <button
          onClick={() => insertLinePrefix('# ')}
          className="p-1 hover:bg-slate-100 rounded text-slate-700"
          title="Judul Bab (#)"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertLinePrefix('### ')}
          className="p-1 hover:bg-slate-100 rounded text-slate-700"
          title="Sub Judul (###)"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => insertLinePrefix('- ')}
          className="p-1 hover:bg-slate-100 rounded text-slate-700"
          title="Daftar Poin (-)"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => wrapSelectionWithTag('$', '$')}
          className="p-1 hover:bg-slate-100 rounded text-slate-700 flex items-center"
          title="Rumus Matematika ($rumus$)"
        >
          <Divide className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const el = textareaRef.current;
            if (!el) return;
            const pos = el.selectionStart;
            const next = content.substring(0, pos) + '\n---\n' + content.substring(pos);
            onChange(next);
          }}
          className="p-1 hover:bg-slate-100 rounded text-slate-700 flex items-center space-x-1"
          title="Ganti Halaman Baru (---)"
        >
          <SplitSquareVertical className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Bagi Halaman</span>
        </button>
      </div>

      {/* Text Area */}
      <div className="flex-1 relative p-3">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ketik catatan, jawaban soal, atau rangkuman di sini...
Contoh format:
# JUDUL BESAR CATATAN
Isi catatan materi dengan [red]poin penting[/red] di sini.
[pencil]Catatan tambahan dengan pensil.[/pencil]
[hl]Gunakan stabilo kuning untuk poin yang wajib dihafal.[/hl]"
          className="w-full h-full resize-none font-mono text-sm leading-relaxed text-slate-800 placeholder-slate-400 bg-transparent outline-none focus:ring-0 border-0"
          spellCheck={false}
        />
      </div>

      {/* Footer Info Bar */}
      <div className="h-8 bg-slate-50 border-t border-slate-200 px-3 flex items-center justify-between text-[11px] text-slate-500 font-medium select-none">
        <div className="flex items-center space-x-3">
          <span>{wordCount} kata</span>
          <span>{totalLines} baris</span>
        </div>
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold">
          <span>{totalPages} Halaman Kertas</span>
        </div>
      </div>
    </div>
  );
};
