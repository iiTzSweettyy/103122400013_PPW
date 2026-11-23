import { Module } from '@nestjs/common';
import { DownloadsService } from './downloads.service.js';
import { DownloadsController } from './downloads.controller.js';

@Module({
  controllers: [DownloadsController],
  providers: [DownloadsService],
})
export class DownloadsModule {}
