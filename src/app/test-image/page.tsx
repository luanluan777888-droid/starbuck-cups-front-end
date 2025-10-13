'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function TestImagePage() {
  const [imageUrl] = useState('https://lh3.googleusercontent.com/d/1NQQnpAWZbuwb1j11l-o19ENLmQnTGpRe=w2000');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Google Drive Image Display</h1>

      <div className="space-y-8">
        {/* Test với thẻ img thông thường */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">1. HTML img tag (Direct)</h2>
          <img
            src={imageUrl}
            alt="Test Google Drive"
            className="max-w-full h-auto"
            onLoad={() => {
              console.log('HTML img loaded successfully');
              setLoading(false);
            }}
            onError={(e) => {
              console.error('HTML img failed to load', e);
              setError('Failed to load with HTML img tag');
            }}
          />
        </div>

        {/* Test với Next.js Image component - unoptimized */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">2. Next.js Image (Unoptimized)</h2>
          <Image
            src={imageUrl}
            alt="Test Google Drive"
            width={800}
            height={600}
            unoptimized
            className="max-w-full h-auto"
            onLoad={() => console.log('Next.js Image (unoptimized) loaded successfully')}
            onError={(e) => console.error('Next.js Image (unoptimized) failed to load', e)}
          />
        </div>

        {/* Test với iframe */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">3. iframe (Direct)</h2>
          <iframe
            src={imageUrl}
            className="w-full h-96 border"
            title="Google Drive Image"
          />
        </div>

        {/* Test với background-image */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">4. CSS Background Image</h2>
          <div
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
            className="w-full h-96 border"
          />
        </div>

        {/* Thông tin */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Image URL Info</h2>
          <p className="mb-2"><strong>URL:</strong></p>
          <code className="block bg-white p-2 rounded break-all">{imageUrl}</code>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded">
              Loading image...
            </div>
          )}
        </div>

        {/* Hướng dẫn */}
        <div className="border p-4 rounded-lg bg-yellow-50">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Tất cả các phương thức trên đều render trực tiếp từ Google Drive, không qua Next.js server</li>
            <li>Kiểm tra Console để xem log khi ảnh load thành công/thất bại</li>
            <li>Google Drive có thể block request từ một số domain hoặc yêu cầu authentication</li>
            <li>Format URL: <code>https://lh3.googleusercontent.com/d/FILE_ID=w2000</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
