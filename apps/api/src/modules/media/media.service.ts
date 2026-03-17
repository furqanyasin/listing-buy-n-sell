import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'

@Injectable()
export class MediaService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    })
  }

  uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'pw-clone/listings',
            resource_type: 'image',
            transformation: [
              {
                width: 1280,
                height: 960,
                crop: 'limit',
                quality: 'auto',
                fetch_format: 'auto',
              },
            ],
          },
          (error, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              reject(new InternalServerErrorException('Image upload failed'))
              return
            }
            resolve({ url: result.secure_url, publicId: result.public_id })
          },
        )
        .end(file.buffer)
    })
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }
}
