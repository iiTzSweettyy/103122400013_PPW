import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateDownloadDto } from './dto/create-download.dto.js';
import { UpdateDownloadDto } from './dto/update-download.dto.js';
import { Download } from './entities/download.entity.js';

@Injectable()
export class DownloadsService {
  private downloads: Download[] = [
    {
      id: 1,
      title: 'Tutorial NestJS Dasar',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      format: 'mp4-720',
      fileSizeMb: 45.2,
      status: 'selesai',
      createdAt: new Date(),
    },
  ];

  create(createDownloadDto: CreateDownloadDto): Download {
    const exists = this.downloads.some((d) => d.url === createDownloadDto.url);
    if (exists) {
      throw new ConflictException('URL YouTube ini sudah ada dalam riwayat');
    }

    const nextId =
      this.downloads.length > 0
        ? Math.max(...this.downloads.map((d) => d.id)) + 1
        : 1;

    const newDownload: Download = {
      id: nextId,
      title: createDownloadDto.title,
      url: createDownloadDto.url,
      format: createDownloadDto.format,
      fileSizeMb: createDownloadDto.fileSizeMb ?? 15.0,
      status: createDownloadDto.status ?? 'pending',
      createdAt: new Date(),
    };

    this.downloads.push(newDownload);
    return newDownload;
  }

  findAll(): Download[] {
    return this.downloads;
  }

  findOne(id: number): Download {
    const item = this.downloads.find((d) => d.id === id);
    if (!item) {
      throw new NotFoundException(`Data unduhan dengan ID ${id} tidak ditemukan`);
    }
    return item;
  }

  update(id: number, updateDownloadDto: UpdateDownloadDto): Download {
    const item = this.findOne(id);
    Object.assign(item, updateDownloadDto);
    return item;
  }

  remove(id: number): { message: string; deleted: Download } {
    const index = this.downloads.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Data unduhan dengan ID ${id} tidak ditemukan`);
    }
    const [deleted] = this.downloads.splice(index, 1);
    return {
      message: `Data unduhan #${id} berhasil dihapus`,
      deleted,
    };
  }
}
