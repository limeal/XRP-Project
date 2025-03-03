import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const storage = {
  async saveFile(file: Buffer, originalName: string): Promise<string> {
    const extension = path.extname(originalName);
    const fileName = `${uuidv4()}${extension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    
    await fs.promises.writeFile(filePath, file);
    
    // Return the URL path to access the file
    return `/uploads/${fileName}`;
  }
}; 