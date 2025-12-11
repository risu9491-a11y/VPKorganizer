export interface VpkFile {
  id: string;
  name: string;
  path: string;
  drive: string;
  size: number; // in bytes
  lastUsed: Date;
  dateAdded: Date;
}
