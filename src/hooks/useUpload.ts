import { useAppSelector } from '@/store';
import type { UploadFolder } from '@/lib/api/upload';

export const useUpload = () => {
  const token = useAppSelector((state) => state.auth.token);

  const buildErrorMessage = async (response: Response) => {
    if (response.status === 413) {
      return "Dung lượng upload vượt giới hạn server. Hãy giảm dung lượng ảnh hoặc upload ít ảnh hơn mỗi lần.";
    }

    const errorData = await response.json().catch(() => ({}));
    return errorData.message || `HTTP error! status: ${response.status}`;
  };

  const uploadSingle = async (file: File, folder: UploadFolder = 'uploads') => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/upload/single`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await buildErrorMessage(response));
    }

    return response.json();
  };

  const uploadMultiple = async (files: File[], folder: UploadFolder = 'uploads') => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/upload/multiple`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      return response.json();
    }

    // Fallback: if server/proxy rejects large multipart payload, upload one-by-one.
    if (response.status === 413 && files.length > 1) {
      const uploadedResults = [];
      for (const file of files) {
        const single = await uploadSingle(file, folder);
        if (!single?.success || !single?.data) {
          throw new Error("Không thể upload từng ảnh sau khi fallback.");
        }
        uploadedResults.push(single.data);
      }

      return {
        success: true,
        data: uploadedResults,
        message: "Uploaded with single-file fallback",
      };
    }

    throw new Error(await buildErrorMessage(response));
  };

  const uploadProductImages = async (files: File[]) => {
    return uploadMultiple(files, 'products');
  };

  const uploadProductImage = async (file: File) => {
    return uploadSingle(file, 'products');
  };

  return {
    uploadSingle,
    uploadMultiple,
    uploadProductImages,
    uploadProductImage,
    isAuthenticated: !!token,
  };
};
