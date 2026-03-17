import { apiClient } from './client'

export interface UploadedImage {
  url: string
  publicId: string
}

export async function uploadImageApi(file: File): Promise<UploadedImage> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<{ success: boolean; data: UploadedImage }>(
    '/media/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.data
}

export async function addListingImagesApi(
  listingId: string,
  images: { url: string; publicId: string; isPrimary?: boolean; order?: number }[],
): Promise<void> {
  await apiClient.post(`/listings/${listingId}/images`, { images })
}
