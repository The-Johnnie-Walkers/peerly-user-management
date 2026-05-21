import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  constructor(private readonly configService: ConfigService) {}

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

    const publicBase = this.getPublicBaseUrl();
    return `${publicBase}/uploads/avatars/${filename}`;
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

  private getPublicBaseUrl(): string {
    const configured =
      this.configService.get<string>('PUBLIC_URL') ??
      this.configService.get<string>('API_PUBLIC_URL');
    if (configured) {
      return configured.replace(/\/$/, '');
    }
    const port = this.configService.get<string>('PORT') ?? '3000';
    return `http://localhost:${port}`;
  }
}
