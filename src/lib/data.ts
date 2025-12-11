import type { VpkFile } from '@/types';

const fileNames = [
  'pak01_dir.vpk', 'scenes.vpk', 'models_01.vpk', 'materials_02.vpk',
  'scripts.vpk', 'sound_vo_english.vpk', 'maps.vpk', 'textures_misc.vpk',
  'ui.vpk', 'particles.vpk', 'hl2_textures_dir.vpk', 'csgo_models.vpk',
  'dota2_heroes.vpk', 'l4d2_weapons.vpk', 'portal2_dlc1.vpk'
];

const drives = ['C:', 'D:', 'E:', 'F:'];
const basePaths = ['/Games/Steam/steamapps/common/', '/Program Files/Games/', '/Backups/VPKs/'];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMockVpkFiles(count: number): VpkFile[] {
  const files: VpkFile[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    const id = `file_${i + 1}_${Date.now()}`;
    const name = getRandomElement(fileNames);
    const drive = getRandomElement(drives);
    const path = `${drive}${getRandomElement(basePaths)}${name}`;
    
    // Ensure unique path for each file
    if (usedNames.has(path)) {
      i--; // try again
      continue;
    }
    usedNames.add(path);

    const size = Math.floor(Math.random() * (2 * 1024 * 1024 * 1024 - 50 * 1024 * 1024)) + 50 * 1024 * 1024; // 50MB to 2GB
    const dateAdded = getRandomDate(new Date(2020, 0, 1), new Date());
    const lastUsed = getRandomDate(dateAdded, new Date());

    files.push({ id, name, path, drive, size, lastUsed, dateAdded });
  }

  // Add some duplicates for the duplicate finder feature
  if (count > 10) {
    for (let i = 0; i < 3; i++) {
      const originalFile = files[i];
      const newDrive = drives.find(d => d !== originalFile.drive) || 'G:';
      const newPath = `${newDrive}${getRandomElement(basePaths)}${originalFile.name}`;
      if(usedNames.has(newPath)) continue;

      files.push({
        ...originalFile,
        id: `file_dup_${i}_${Date.now()}`,
        drive: newDrive,
        path: newPath,
        dateAdded: getRandomDate(new Date(2020, 0, 1), new Date()),
      });
      usedNames.add(newPath);
    }
  }


  return files;
}
