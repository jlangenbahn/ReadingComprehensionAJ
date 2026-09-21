import type { ReactNode } from "react";

type Interval = { start: number; end: number };

function collectIntervals(passage: string, quotes: string[]): Interval[] {
  const haystack = passage.toLowerCase();
  const found: Interval[] = [];

  for (const raw of quotes) {
    const quote = raw.trim();
    if (!quote) continue;

    const exact = haystack.indexOf(quote.toLowerCase());
    if (exact >= 0) {
      found.push({ start: exact, end: exact + quote.length });
      continue;
    }

    const snippet = quote.toLowerCase().slice(0, Math.min(quote.length, 48));
    if (snippet.length < 12) continue;
    const fallback = haystack.indexOf(snippet);
    if (fallback >= 0) {
      found.push({ start: fallback, end: fallback + snippet.length });
    }
  }

  found.sort((a, b) => a.start - b.start);
  const merged: Interval[] = [];
  for (const interval of found) {
    const last = merged[merged.length - 1];
    if (!last || interval.start > last.end) {
      merged.push({ ...interval });
    } else {
      last.end = Math.max(last.end, interval.end);
    }
  }
  return merged;
}

export function highlightPassage(passage: string, quotes: string[]): ReactNode {
  const intervals = collectIntervals(passage, quotes);
  if (!intervals.length) return passage;

  const parts: ReactNode[] = [];
  let cursor = 0;
  intervals.forEach((interval, index) => {
    if (interval.start > cursor) {
      parts.push(passage.slice(cursor, interval.start));
    }
    parts.push(
      <mark className="passage-mark" key={`${interval.start}-${index}`}>
        {passage.slice(interval.start, interval.end)}
      </mark>,
    );
    cursor = interval.end;
  });
  if (cursor < passage.length) {
    parts.push(passage.slice(cursor));
  }
  return parts;
}
