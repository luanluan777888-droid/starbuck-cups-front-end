'use client';

import { PropertyGallery } from '@/components/ui/PropertyGallery';

export default function TestImagePage() {
  // Test images from Google Drive
  const testImages = [
    {
      id: 'b07f8c31-5cbb-4f97-baaf-14ce337de659',
      url: 'https://drive.google.com/uc?export=view&id=1vUnGK7HBcMN-ezuFi83ISKEYNxNVCLGR',
      altText: 'Ly dion chim sẻ trắng nhủ Collection Wild Nordic-tag CHINA(591ml)',
      order: 0,
    },
    {
      id: 'f2914cb4-9d97-4afc-90b4-c5d53472c774',
      url: 'https://drive.google.com/uc?export=view&id=17B-34odkC34R5SB8m8OPUifjmSlYUqfk',
      altText: 'Ly dion chim sẻ trắng nhủ Collection Wild Nordic-tag CHINA(591ml)',
      order: 1,
    },
    {
      id: '8c66f1ab-47c2-4b61-b9cc-90725b14565a',
      url: 'https://drive.google.com/uc?export=view&id=1SzxR5y3Uv4UsM_8zknQvkhP1VU9LRFJB',
      altText: 'Ly dion chim sẻ trắng nhủ Collection Wild Nordic-tag CHINA(591ml)',
      order: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Test Google Drive Images Gallery
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Gallery Component */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">
              PropertyGallery Component (như trang sản phẩm)
            </h2>
            <PropertyGallery
              images={testImages.map((img) => img.url)}
              title="Ly dion chim sẻ trắng nhủ Collection Wild Nordic"
              isVip={true}
            />
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <div className="border border-zinc-700 p-4 rounded-lg bg-zinc-900">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Thông tin Test
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-zinc-400 text-sm mb-2">
                    Số lượng ảnh: {testImages.length}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-400 text-sm mb-2">URLs được test:</p>
                  <div className="space-y-2">
                    {testImages.map((img, index) => (
                      <div
                        key={img.id}
                        className="bg-zinc-800 p-2 rounded text-xs break-all"
                      >
                        <p className="text-zinc-500 mb-1">Image {index + 1}:</p>
                        <code className="text-zinc-300">{img.url}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-zinc-700 p-4 rounded-lg bg-zinc-900">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Tính năng Gallery
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 text-sm">
                <li>
                  Click vào ảnh chính để mở modal fullscreen
                </li>
                <li>
                  Swipe hoặc dùng nút mũi tên để chuyển ảnh
                </li>
                <li>
                  Click vào thumbnail để chuyển đến ảnh đó
                </li>
                <li>
                  Trong modal: scroll chuột để zoom, kéo để di chuyển
                </li>
                <li>
                  Phím mũi tên trái/phải để chuyển ảnh
                </li>
                <li>
                  Phím ESC để đóng modal
                </li>
                <li>
                  Badge VIP hiển thị ở góc trên bên phải
                </li>
              </ul>
            </div>

            <div className="border border-yellow-500/30 p-4 rounded-lg bg-yellow-500/5">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">
                Lưu ý
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-300 text-sm">
                <li>
                  Tất cả ảnh được load trực tiếp từ Google Drive
                </li>
                <li>
                  Sử dụng Next.js Image component với unoptimized (không qua
                  Next.js server)
                </li>
                <li>
                  Kiểm tra Console để xem log load ảnh
                </li>
                <li>
                  Format URL Google Drive: drive.google.com/uc?export=view&id=FILE_ID
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
