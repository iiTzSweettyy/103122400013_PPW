import { PartialType } from '@nestjs/mapped-types';
import { CreateDownloadDto } from './create-download.dto.js';

export class UpdateDownloadDto extends PartialType(CreateDownloadDto) {}
