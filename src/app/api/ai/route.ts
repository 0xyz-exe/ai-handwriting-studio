import { NextRequest, NextResponse } from 'next/server';

export interface AiRequestPayload {
  action: 'clean_notes' | 'grammar_check' | 'summarize' | 'format_qa' | 'student_paraphrase' | 'custom';
  content: string;
  customPrompt?: string;
  apiKey?: string;
  provider?: 'openrouter' | 'openai' | 'gemini';
}

// Offline heuristic fallback when external AI key is absent
function heuristicTransform(action: string, content: string, customPrompt?: string): string {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);

  if (action === 'clean_notes') {
    let result = `# CATATAN TERSUSUN RAPI\n\n`;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (i === 0) {
        result += `[blue]${line}[/blue]\n\n`;
      } else if (line.endsWith(':') || line.length < 35) {
        result += `### ${line.replace(/[:]$/, '')}\n`;
      } else {
        result += `- ${line}\n`;
      }
    }
    return result;
  }

  if (action === 'grammar_check') {
    // Basic Indonesian spelling corrections & punctuation fixes
    let text = content
      .replace(/\s+/g, ' ')
      .replace(/\s,(\s*)/g, ', ')
      .replace(/\s\.(\s*)/g, '. ')
      .replace(/di\s(mana|sini|situ|antara|bawah|atas|dalam|luar)/gi, 'di $1')
      .replace(/di\s(tulis|baca|makan|buat|susun|kerjakan)/gi, 'di$1')
      .replace(/\b(yg|kpd|dgn|utk|krn|pd|sdh|blm)\b/gi, (match) => {
        const m = match.toLowerCase();
        if (m === 'yg') return 'yang';
        if (m === 'kpd') return 'kepada';
        if (m === 'dgn') return 'dengan';
        if (m === 'utk') return 'untuk';
        if (m === 'krn') return 'karena';
        if (m === 'pd') return 'pada';
        if (m === 'sdh') return 'sudah';
        if (m === 'blm') return 'belum';
        return match;
      });
    return text;
  }

  if (action === 'summarize') {
    let summary = `# RANGKUMAN INTI MATERI\n\n`;
    const sentences = content.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 5);
    const keyPoints = sentences.slice(0, Math.min(5, sentences.length));
    for (const point of keyPoints) {
      summary += `- [blue]Poin Utama[/blue]: ${point}.\n`;
    }
    summary += `\n[red]Kesimpulan[/red]: Materi di atas mencakup konsep penting yang wajib dipelajari sebelum ujian.`;
    return summary;
  }

  if (action === 'format_qa') {
    let qa = `# DAFTAR SOAL DAN PEMBAHASAN\n\n`;
    lines.forEach((line, idx) => {
      qa += `### Soal ${idx + 1}:\n${line}\n\n`;
      qa += `[blue]Jawaban[/blue]:\nLangkah penyelesaian disesuaikan dengan konsep dasar.\n[red]Hasil akhir: Terbukti benar.[/red]\n\n`;
    });
    return qa;
  }

  if (action === 'student_paraphrase') {
    return `# CATATAN RINGKAS SISWA\n\n${content}\n\n[pencil]Catatan pribadi: Pahami alur logikanya, jangan cuma dihafal kata per katanya![/pencil]`;
  }

  return content;
}

export async function POST(req: NextRequest) {
  try {
    const body: AiRequestPayload = await req.json();
    const { action, content, customPrompt, apiKey, provider } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const key = apiKey || process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY;

    // If API key is available, call external LLM
    if (key) {
      let promptText = '';
      if (action === 'clean_notes') {
        promptText = `Kamu asisten catatan siswa. Rapikan catatan berikut menjadi format catatan buku tulis yang bersih. Gunakan tag [blue]judul[/blue], [red]kata penting[/red], [pencil]catatan kecil[/pencil], dan [hl]highlight penting[/hl] secukupnya. Teks:\n\n${content}`;
      } else if (action === 'grammar_check') {
        promptText = `Perbaiki ejaan, tata bahasa, huruf kapital, dan tanda baca pada teks catatan bahasa Indonesia ini tanpa mengubah maksud aslinya:\n\n${content}`;
      } else if (action === 'summarize') {
        promptText = `Buat rangkuman catatan ringkas 3-5 poin inti dalam bahasa Indonesia yang cocok ditulis di buku catatan:\n\n${content}`;
      } else if (action === 'format_qa') {
        promptText = `Format teks berikut menjadi daftar Soal dan Pembahasan bernomor yang rapi untuk tugas sekolah:\n\n${content}`;
      } else if (action === 'student_paraphrase') {
        promptText = `Parafrase teks berikut dengan gaya bahasa catatan siswa yang natural, ringkas, dan mudah dipahami:\n\n${content}`;
      } else {
        promptText = `${customPrompt || 'Bantu perbaiki teks ini:'}\n\n${content}`;
      }

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
              {
                role: 'system',
                content: 'Kamu adalah asisten AI Handwriting Studio untuk pelajar dan mahasiswa di Indonesia.',
              },
              { role: 'user', content: promptText },
            ],
            temperature: 0.7,
            max_tokens: 1500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const transformed = data?.choices?.[0]?.message?.content;
          if (transformed) {
            return NextResponse.json({
              success: true,
              result: transformed.trim(),
              provider: 'llm',
            });
          }
        }
      } catch (e) {
        console.warn('External AI call failed, falling back to heuristic:', e);
      }
    }

    // Heuristic offline fallback
    const result = heuristicTransform(action, content, customPrompt);
    return NextResponse.json({
      success: true,
      result,
      provider: 'heuristic-offline',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
