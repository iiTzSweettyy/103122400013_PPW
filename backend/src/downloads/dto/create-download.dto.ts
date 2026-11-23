import { IsUrl, IsString, MinLength, IsIn, IsNumber, IsOptional } from 'class-validator';

export class CreateDownloadDto {
  @IsUrl({}, { message: 'URL YouTube tidak valid' })
  url: string;

  @IsString()
  @MinLength(3, { message: 'Judul minimal 3 karakter' })
  title: string;

  @IsIn(['mp4-1080', 'mp4-720', 'mp3-320'], { message: 'Format tidak didukung' })
  format: string;

  @IsNumber()
  @IsOptional()
  fileSizeMb?: number;

  @IsIn(['pending', 'selesai', 'gagal'])
  @IsOptional()
  status?: 'pending' | 'selesai' | 'gagal';
}
