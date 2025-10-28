"use client";

import React from 'react';
import { PH1, PH2, PH3 } from '@/lib/placeholders';
import BackButton from '@/components/ui/BackButton';

const products = {
  'p-1': { id: 'p-1', title: '限定プリントセット (A4 10枚)', price: 3500, images: [PH1, PH2], description: '人気メンバーの作品を厳選したプリントセット。額装にもおすすめです。', stock: 12 },
  'p-2': { id: 'p-2', title: 'フォトブック（20ページ）', price: 4800, images: [PH2], description: 'イベント写真をまとめたフォトブック。ギフトにも最適。', stock: 5 },
  'p-3': { id: 'p-3', title: 'ワークショップ参加券', price: 1200, images: [PH3], description: '次回ワークショップの参加券です。', stock: 30 }
};

export default function ProductPage(props: any){
  const params = props?.params || {};
  const p = products[params.id as keyof typeof products] || null;
  const [qty, setQty] = React.useState(1);

  if(!p) return (<div className="p-6"><h2 className="text-xl font-bold">商品が見つかりません</h2></div>);

  const addToCart = () => {
    try{
      const raw = localStorage.getItem('cocoty_cart_v1');
      const cart = raw ? JSON.parse(raw) : [];
      const found = cart.find((x:any)=> x.id===p.id);
      if(found){ found.qty += qty; } else { cart.unshift({ id: p.id, title: p.title, price: p.price, qty }); }
      localStorage.setItem('cocoty_cart_v1', JSON.stringify(cart));
      alert('カートに追加しました');
    }catch(e){ alert('エラーが発生しました'); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <BackButton className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]} alt={p.title} className="w-full h-96 object-cover rounded-lg" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{p.title}</h1>
          <div className="text-2xl font-bold mt-3">{p.price.toLocaleString()} JPY</div>
          <p className="mt-4 text-sm text-gray-700">{p.description}</p>
          <div className="mt-6">
            <label className="text-sm mr-2">数量</label>
            <input type="number" value={qty} min={1} onChange={(e)=>setQty(Number(e.target.value))} className="w-20 px-2 py-1 border rounded" />
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={addToCart} className="px-4 py-2 bg-amber-500 text-white rounded">カートに追加</button>
            <a href={`https://example.com/buy/${p.id}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-stone-100 rounded">外部購入</a>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-2">レビュー</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div className="font-medium">山田 花子</div>
                  <div className="text-sm text-gray-500">2025-02-12</div>
                </div>
                <div className="mt-1 text-sm text-amber-500">★★★★★</div>
                <div className="mt-2 text-sm text-gray-700">写真の仕上がりがとても良かったです。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
