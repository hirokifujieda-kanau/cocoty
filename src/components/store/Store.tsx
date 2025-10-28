 'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PH1, PH2, PH3 } from '@/lib/placeholders';

const ALBUM_KEY = 'cocoty_albums_v1';

type AlbumItem = { id: string; title: string; images: string[]; source?: 'user' | 'store' };
type Product = {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category?: string;
  rating?: number; // 0-5
  reviews?: number;
  stock?: number;
};

const sampleProducts: Product[] = [
  {
    id: 'p-1',
    title: '限定プリントセット (A4 10枚)',
    price: 3500,
    images: [PH1,PH2],
    description: '人気メンバーの作品を厳選したプリントセット。額装にもおすすめです。',
    category: 'プリント',
    rating: 4.6,
    reviews: 42,
    stock: 12
  },
  {
    id: 'p-2',
    title: 'フォトブック（20ページ）',
    price: 4800,
    images: [PH2],
    description: 'イベント写真をまとめたフォトブック。ギフトにも最適。',
    category: 'フォトブック',
    rating: 4.2,
    reviews: 18,
    stock: 5
  },
  {
    id: 'p-3',
    title: 'ワークショップ参加券',
    price: 1200,
    images: [PH3],
    description: '次回ワークショップの参加券です。定員制のためお早めに。',
    category: 'イベント',
    rating: 4.9,
    reviews: 120,
    stock: 30
  }
];

const priceFormat = (n: number) => `${n.toLocaleString()} JPY`;

const Store: React.FC = () => {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [tab, setTab] = useState<'showcase' | 'albums'>('showcase');

  // showcase state
  const [products] = useState<Product[]>(sampleProducts);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'popular'|'new'|'price-asc'|'price-desc'>('popular');
  // product modal state removed: use dedicated product pages instead
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Array<{ id: string; title: string; price: number; qty: number }>>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    try { const raw = localStorage.getItem(ALBUM_KEY); if (raw) setAlbums(JSON.parse(raw)); } catch (e) {}
  }, []);

  const filtered = products.filter(p => {
    if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // categories derived from products
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

  // sorting
  const sorted = [...filtered].sort((a,b) => {
    switch(sort){
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'new': return b.id.localeCompare(a.id);
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  // pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page-1)*pageSize, page*pageSize);

  // cart helpers
  const addToCart = (p:{id:string,title:string,price:number}, qty=1) => {
    setCart(prev => {
      const found = prev.find(x=>x.id===p.id);
      if(found){
        return prev.map(x=> x.id===p.id ? { ...x, qty: x.qty + qty } : x);
      }
      return [{ id: p.id, title: p.title, price: p.price, qty }, ...prev];
    });
    setCartOpen(true);
  };
  const updateQty = (id:string, qty:number) => setCart(prev => prev.map(x=> x.id===id?{...x, qty: Math.max(0, qty)}:x).filter(x=>x.qty>0));
  const cartTotal = cart.reduce((s,x)=>s + x.price * x.qty, 0);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <button onClick={() => setTab('showcase')} className={`px-4 py-2 rounded ${tab === 'showcase' ? 'bg-slate-800 text-white' : 'bg-stone-100'}`}>
          ショーケース
        </button>
        <button onClick={() => setTab('albums')} className={`px-4 py-2 rounded ${tab === 'albums' ? 'bg-slate-800 text-white' : 'bg-stone-100'}`}>
          アルバム
        </button>
      </div>

      {tab === 'showcase' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="商品名や説明を検索" className="px-3 py-2 border rounded w-80" />
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="px-2 py-2 border rounded">
                <option value="popular">人気順</option>
                <option value="new">新着</option>
                <option value="price-asc">価格：安い順</option>
                <option value="price-desc">価格：高い順</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">{filtered.length} 件表示</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border shadow-lg overflow-hidden group">
                <div className="relative h-56 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  {/* badge */}
                  <div className="absolute left-3 top-3 bg-amber-500 text-white text-xs px-2 py-1 rounded">{(p.rating||0).toFixed(1)} ★</div>
                  {p.stock !== undefined && (
                    <div className="absolute right-3 top-3 bg-white/90 text-sm text-gray-700 px-2 py-1 rounded">残 {p.stock}</div>
                  )}
                  {/* overlay actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <button onClick={() => addToCart(p, 1)} className="px-3 py-2 bg-amber-500 text-white rounded-lg">カートに入れる</button>
                      <button onClick={() => router.push(`/store/product/${p.id}`)} className="px-3 py-2 bg-black/70 text-white rounded-lg">詳細を見る</button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{p.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-2xl font-bold">{priceFormat(p.price)}</div>
                    <div className="text-sm text-gray-500">{p.reviews}件</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 bg-stone-100 rounded">前へ</button>
            <div className="text-sm">{page} / {totalPages}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 bg-stone-100 rounded">次へ</button>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="ml-3 px-2 py-1 border rounded">
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
            <button onClick={() => setCartOpen(true)} className="ml-4 px-3 py-1 bg-amber-500 text-white rounded">カート ({cart.length})</button>
          </div>

          {/* Cart modal */}
          {cartOpen && (
            <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-40 p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">カート</h3>
                  <button onClick={() => setCartOpen(false)} className="text-gray-500">閉じる</button>
                </div>
                <div className="space-y-3">
                  {cart.length === 0 && <div className="text-sm text-gray-500">カートに商品がありません。</div>}
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">{priceFormat(item.price)} x {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 py-1 bg-stone-100 rounded">-</button>
                        <div className="px-2">{item.qty}</div>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 py-1 bg-stone-100 rounded">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-bold">合計: {priceFormat(cartTotal)}</div>
                  <div>
                    <button onClick={() => { /* external checkout placeholder */ window.open('https://example.com/checkout', '_blank'); }} className="px-4 py-2 bg-amber-500 text-white rounded">外部決済へ</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product modal removed - product details are on dedicated pages */}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-2">アルバムを選ぶ（テンプレート）</h3>
            <p className="text-sm text-gray-500 mb-3">既製のアルバムデザインから選択して、マイアルバムとして追加できます。販売や決済は外部サイトで行ってください。</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(
                // sample designs
                [
                  { id: 'd1', title: 'クラシックフォトブック', images: [PH1, PH2], desc: 'シンプルで落ち着いたデザイン。', price: 2000 },
                  { id: 'd2', title: 'モダンプリントセット', images: [PH2, PH3], desc: 'コントラスト強めの高級感ある仕上がり。', price: 2500 },
                  { id: 'd3', title: 'ミニアルバム', images: [PH3], desc: 'コンパクトでギフトにぴったり。', price: 1500 }
                ]
              ).map((d:any) => (
                <div key={d.id} className="bg-white rounded-lg border overflow-hidden group shadow-md">
                  <div className="relative h-44">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.images[0]} alt={d.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute left-3 top-3 bg-white/80 px-2 py-1 text-sm rounded">¥{d.price.toLocaleString()}</div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{d.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{d.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <button onClick={() => {
                        const item: AlbumItem = { id: String(Date.now()), title: d.title, images: d.images, source: 'store' };
                        const next = [item, ...albums];
                        setAlbums(next);
                        try { localStorage.setItem(ALBUM_KEY, JSON.stringify(next)); } catch (e) {}
                      }} className="px-3 py-2 bg-slate-700 text-white rounded">選択して追加</button>
                      <button onClick={() => router.push(`/store/template/${d.id}`)} className="px-3 py-2 bg-stone-100 rounded">プレビュー</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          

          <div>
            <h3 className="text-lg font-medium mb-3">マイアルバム</h3>
            
            {/* 購入済みアルバム */}
            <div className="mb-6 bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-3 text-emerald-700">購入済みアルバム</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {albums.filter(a => a.source === 'store').map((a) => (
                  <button key={a.id} onClick={() => router.push(`/album/${a.id}`)} className="text-left bg-emerald-50 rounded-lg border border-emerald-200 p-3 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{a.title}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{a.images.length}枚</span>
                        <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-800">購入済み</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {a.images.slice(0,3).map((img:string, i:number) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={img} alt={`img-${i}`} className="w-full h-16 object-cover rounded" />
                      ))}
                    </div>
                  </button>
                ))}
                {albums.filter(a => a.source === 'store').length === 0 && (
                  <div className="text-sm text-gray-500 col-span-2">購入済みアルバムがありません</div>
                )}
              </div>
            </div>

            {/* 作成済みアルバム */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-700">作成済みアルバム</h4>
                <button 
                  onClick={() => router.push('/album/create')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <span>＋</span>
                  新しいアルバムを作成
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {albums.filter(a => a.source === 'user').map((a) => (
                  <button key={a.id} onClick={() => router.push(`/album/${a.id}`)} className="text-left bg-slate-50 rounded-lg border border-slate-200 p-3 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{a.title}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{a.images.length}枚</span>
                        <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-800">作成済み</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {a.images.slice(0,3).map((img:string, i:number) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={img} alt={`img-${i}`} className="w-full h-16 object-cover rounded" />
                      ))}
                    </div>
                  </button>
                ))}
                {albums.filter(a => a.source === 'user').length === 0 && (
                  <div className="text-sm text-gray-500 col-span-2">作成済みアルバムがありません</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
