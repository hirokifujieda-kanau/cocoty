"use client";

import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function AlbumPage(props: any){
  const params = props?.params || {};
  const id = params.id;
  const [albums, setAlbums] = React.useState<any[]>([]);
  const [a, setA] = React.useState<any | null>(null);
  const [sliderOpen, setSliderOpen] = React.useState(false);
  const [sliderIndex, setSliderIndex] = React.useState(0);
  const [editMode, setEditMode] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('cocoty_albums_v1');
      const albumsList = raw ? JSON.parse(raw) : [];
      setAlbums(albumsList);
      const album = albumsList.find((x:any) => x.id === id) || null;
      setA(album);
      setEditTitle(album?.title || '');
    }
  }, [id]);

  const saveAlbum = () => {
    if (!a) return;
    const updated = { ...a, title: editTitle };
    const newAlbums = albums.map(album => album.id === a.id ? updated : album);
    setAlbums(newAlbums);
    setA(updated);
    localStorage.setItem('cocoty_albums_v1', JSON.stringify(newAlbums));
    setEditMode(false);
  };

  const deleteAlbum = () => {
    if (!a || !confirm('このアルバムを削除しますか？')) return;
    const newAlbums = albums.filter(album => album.id !== a.id);
    setAlbums(newAlbums);
    localStorage.setItem('cocoty_albums_v1', JSON.stringify(newAlbums));
    window.location.href = '/store';
  };

  if(!a) return <div className="p-6">アルバムが見つかりません</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <BackButton className="mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          {editMode ? (
            <input 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-2xl font-bold border-b-2 border-amber-500 bg-transparent outline-none"
            />
          ) : (
            <h1 className="text-2xl font-bold">{a.title}</h1>
          )}
          <div className="text-sm text-gray-500">{a.source === 'store' ? '購入済みのアルバム' : '作成済みのアルバム'}</div>
        </div>
        
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button onClick={saveAlbum} className="px-3 py-2 bg-green-600 text-white rounded">保存</button>
              <button onClick={() => { setEditMode(false); setEditTitle(a.title); }} className="px-3 py-2 bg-gray-500 text-white rounded">キャンセル</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="px-3 py-2 bg-blue-600 text-white rounded">編集</button>
              <button onClick={deleteAlbum} className="px-3 py-2 bg-red-600 text-white rounded">削除</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {a.images.map((img:string, i:number) => (
          <button 
            key={i} 
            onClick={() => { setSliderIndex(i); setSliderOpen(true); }}
            className="relative group overflow-hidden rounded-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`img-${i}`} className="w-full h-56 object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">🔍</div>
            </div>
          </button>
        ))}
      </div>

      {/* Fullscreen Slider */}
      {sliderOpen && (
        <div className="fixed inset-0 z-80 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.images[sliderIndex]} alt={`slide-${sliderIndex}`} className="max-w-full max-h-full object-contain" />
            
            {/* Controls */}
            <button 
              onClick={() => setSliderOpen(false)} 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded text-xl"
            >
              ✕
            </button>
            
            <button 
              onClick={() => setSliderIndex(i => Math.max(0, i-1))} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded text-2xl"
            >
              ‹
            </button>
            
            <button 
              onClick={() => setSliderIndex(i => Math.min(a.images.length-1, i+1))} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded text-2xl"
            >
              ›
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
              {sliderIndex + 1} / {a.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
