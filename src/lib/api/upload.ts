const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    key: string;
    filename: string;
    size: number;
    mimetype: string;
  };
  message: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  data: Array<{
    url: string;
    key: string;
    filename: string;
    size: number;
    mimetype: string;
  }>;
  message: string;
}

export type UploadFolder = 'products' | 'categories' | 'colors' | 'avatars' | 'uploads';

class UploadAPI {
  private async buildErrorMessage(response: Response): Promise<string> {
    if (response.status === 413) {
      return "Dung lượng upload vượt giới hạn server. Hãy giảm dung lượng ảnh hoặc upload ít ảnh hơn mỗi lần.";
    }

    const errorData = await response.json().catch(() => ({}));
    return errorData.message || `HTTP error! status: ${response.status}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(await this.buildErrorMessage(response));
    }

    return response.json();
  }

  /**
   * Upload single file
   */
  async uploadSingle(file: File, folder: UploadFolder = 'uploads'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return this.request<UploadResponse>('/admin/upload/single', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(files: File[], folder: UploadFolder = 'uploads'): Promise<MultipleUploadResponse> {
    const formData = new FormData();

    // Append all files with the same field name 'images'
    files.forEach((file) => {
      formData.append('images', file);
    });

    formData.append('folder', folder);

    const url = `${API_BASE_URL}/admin/upload/multiple`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (response.ok) {
      return response.json();
    }

    if (response.status === 413 && files.length > 1) {
      const uploadedResults: MultipleUploadResponse["data"] = [];
      for (const file of files) {
        const single = await this.uploadSingle(file, folder);
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

    throw new Error(await this.buildErrorMessage(response));
  }

  /**
   * Delete file by key
   */
  async deleteFile(key: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/admin/upload/delete?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get signed URL for temporary access
   */
  async getSignedUrl(key: string, expires: number = 3600): Promise<{
    success: boolean;
    data: {
      url: string;
      expires: number;
    };
    message: string;
  }> {
    return this.request<{
      success: boolean;
      data: {
        url: string;
        expires: number;
      };
      message: string;
    }>(`/admin/upload/signed-url?key=${encodeURIComponent(key)}&expires=${expires}`);
  }

  /**
   * Upload files for products specifically
   */
  async uploadProductImages(files: File[]): Promise<MultipleUploadResponse> {
    return this.uploadMultiple(files, 'products');
  }

  /**
   * Upload single product image
   */
  async uploadProductImage(file: File): Promise<UploadResponse> {
    return this.uploadSingle(file, 'products');
  }
}

export const uploadAPI = new UploadAPI();
