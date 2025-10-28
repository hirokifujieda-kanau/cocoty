'use client';

import React from 'react';
import BackButton from '@/components/ui/BackButton';
import { PH1, PH2, PH3 } from '@/lib/placeholders';

const templates = {
  d1: { id: 'd1', title: 'クラシックフォトブック', images: [PH1, PH2], desc: 'シンプルで落ち着いたデザイン。', price: 2000 },
  d2: { id: 'd2', title: 'モダンプリントセット', images: [PH2, PH3], desc: 'コントラスト強めの高級感ある仕上がり。', price: 2500 },
  d3: { id: 'd3', title: 'ミニアルバム', images: [PH3], desc: 'コンパクトでギフトにぴったり。', price: 1500 }
};

export default function TemplatePage(props: any) {
  const params = props?.params || {};
  const tpl = templates[params.id as keyof typeof templates] || null;

  const [index, setIndex] = React.useState(0);
  const imgCount = tpl ? tpl.images.length : 0;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(0, i-1));
      if (e.key === 'ArrowRight') setIndex(i => Math.min(imgCount-1, i+1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [imgCount]);

  // touch / swipe
  const startXRef = React.useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => startXRef.current = e.touches[0].clientX;
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startXRef.current == null) return;
    const dx = e.changedTouches[0].clientX - startXRef.current;
    if (dx > 50) setIndex(i => Math.max(0, i-1));
    if (dx < -50) setIndex(i => Math.min(imgCount-1, i+1));
    startXRef.current = null;
  };

  if (!tpl) return (
    <div className="p-8">
      <h2 className="text-xl font-bold">テンプレートが見つかりません</h2>
    </div>
  );

  const addToAlbums = () => {
    try {
      const raw = localStorage.getItem('cocoty_albums_v1');
      const albums = raw ? JSON.parse(raw) : [];
      albums.unshift({ id: String(Date.now()), title: tpl.title, images: tpl.images, source: 'store' });
      localStorage.setItem('cocoty_albums_v1', JSON.stringify(albums));
      alert('マイアルバムに追加しました');
    } catch (e) { alert('追加に失敗しました'); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {/* main image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tpl.images[index]} alt={`tpl-${index}`} className="w-full h-80 object-cover rounded-lg" />
            <button onClick={() => setIndex(i => Math.max(0, i-1))} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded">‹</button>
            <button onClick={() => setIndex(i => Math.min(imgCount-1, i+1))} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded">›</button>

            {/* thumbnails */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {tpl.images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <button key={i} onClick={() => setIndex(i)} className={`overflow-hidden rounded ${i===index? 'ring-2 ring-amber-400':'ring-0'}`}>
                  <img src={img} alt={`thumb-${i}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{tpl.title}</h1>
          <div className="text-sm text-gray-600 mt-2">{tpl.desc}</div>
          <div className="text-2xl font-bold mt-4">{tpl.price.toLocaleString()} JPY</div>
          <div className="mt-6 flex gap-3">
            <a href={`https://example.com/buy/template/${tpl.id}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-amber-500 text-white rounded">外部購入ページへ</a>
            <button onClick={addToAlbums} className="px-4 py-2 bg-slate-700 text-white rounded">マイアルバムに追加</button>
          </div>
          {/* Reviews */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">レビュー</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div className="font-medium">田中 花子</div>
                  <div className="text-sm text-gray-500">2025-04-01</div>
                </div>
                <div className="mt-1 text-sm text-amber-500">★★★★★</div>
                <div className="mt-2 text-sm text-gray-700">実物も素敵でした！作りがしっかりしていて満足です。</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div className="font-medium">佐藤 太郎</div>
                  <div className="text-sm text-gray-500">2025-03-20</div>
                </div>
                <div className="mt-1 text-sm text-amber-500">★★★★☆</div>
                <div className="mt-2 text-sm text-gray-700">写真の発色が良く、プレゼントに喜ばれました。</div>
              </div>
            </div>
          </div>

          {/* Related products */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">関連商品</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'p-1', title: '限定プリントセット (A4 10枚)', price: 3500, img: PH1 },
                { id: 'p-2', title: 'フォトブック（20ページ）', price: 4800, img: PH2 },
                { id: 'p-3', title: 'ワークショップ参加券', price: 1200, img: PH3 }
              ].map(p => (
                <div key={p.id} className="bg-white rounded-lg border p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className="w-full h-28 object-cover rounded" />
                  <div className="mt-2 font-medium">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.price.toLocaleString()} JPY</div>
                  <div className="mt-2 flex gap-2">
                    <a href={`https://example.com/buy/${p.id}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-amber-500 text-white rounded">購入</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-500">左/右矢印キー、またはスワイプで画像を切り替えられます。</div>
        </div>
      </div>
    </div>
  );
}
