export class Download {
  id: number;
  title: string;
  url: string;
  format: string;
  fileSizeMb: number;
  status: 'pending' | 'selesai' | 'gagal';
  createdAt: Date;
}
