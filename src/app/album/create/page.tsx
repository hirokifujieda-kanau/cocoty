"use client";

import React from 'react';
import BackButton from '@/components/ui/BackButton';
import AuthGuard from '@/components/auth/AuthGuard';

const ALBUM_KEY = 'cocoty_albums_v1';

function CreateAlbumContent() {
  const [title, setTitle] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreate = (files?: FileList | null) => {
    if (!files || files.length === 0 || !title.trim()) {
      alert('タイトルと画像を選択してください');
      return;
    }

    setIsCreating(true);
    
    const readers: Promise<string>[] = [];
    for (const file of Array.from(files)) {
      readers.push(new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(file);
      }));
    }

    Promise.all(readers).then((images) => {
      try {
        const raw = localStorage.getItem(ALBUM_KEY);
        const albums = raw ? JSON.parse(raw) : [];
        const newAlbum = { 
          id: String(Date.now()), 
          title: title.trim(), 
          images, 
          source: 'user' 
        };
        const updatedAlbums = [newAlbum, ...albums];
        localStorage.setItem(ALBUM_KEY, JSON.stringify(updatedAlbums));
        
        alert('アルバムを作成しました！');
        window.location.href = '/store';
      } catch (e) {
        alert('アルバムの作成に失敗しました');
      } finally {
        setIsCreating(false);
      }
    }).catch(() => {
      alert('画像の読み込みに失敗しました');
      setIsCreating(false);
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BackButton className="mb-4" />
      
      <h1 className="text-2xl font-bold mb-6">新しいアルバムを作成</h1>
      
      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">アルバムタイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：夏の思い出、旅行写真など"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCreating}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">画像を選択</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleCreate(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isCreating}
            />
            <p className="text-sm text-gray-500 mt-1">
              複数の画像を選択できます。選択すると自動的にアルバムが作成されます。
            </p>
          </div>
        </div>
        
        {isCreating && (
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">アルバムを作成しています...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateAlbumPage() {
  return (
    <AuthGuard requireAuth={true}>
      <CreateAlbumContent />
    </AuthGuard>
  );
}