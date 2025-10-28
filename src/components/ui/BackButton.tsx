import React from 'react';

export default function BackButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => { if (typeof window !== 'undefined') window.history.back(); }}
      className={"inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 " + (className || '')}
    >
      <span className="text-2xl leading-none">‹</span>
      <span>戻る</span>
    </button>
  );
}
