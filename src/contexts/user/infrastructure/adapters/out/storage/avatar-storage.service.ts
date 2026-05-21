import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const UPLOADS_DIR = join(process.cwd(), 'uploads', 'avatars');
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export interface AvatarUploadFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

@Injectable()
export class AvatarStorageService {
  async save(userId: string, file: AvatarUploadFile): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new InternalServerErrorException('El archivo debe ser una imagen.');
    }
    if (file.size > MAX_AVATAR_BYTES) {
      throw new InternalServerErrorException('La imagen no puede superar 5 MB.');
    }

    const extension = this.resolveExtension(file);
    const filename = `${userId}-${Date.now()}${extension}`;

    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(join(UPLOADS_DIR, filename), file.buffer);

    // Ruta relativa: el frontend la resuelve con VITE_USER_MGMT_URL (evita localhost en preprod)
    return `/uploads/avatars/${filename}`;
  }

  private resolveExtension(file: AvatarUploadFile): string {
    const fromName = extname(file.originalname).toLowerCase();
    if (fromName && /^\.(jpe?g|png|gif|webp)$/.test(fromName)) {
      return fromName;
    }
    const mimeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    return mimeMap[file.mimetype] ?? '.jpg';
  }

}
