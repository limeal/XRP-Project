import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
console.log('Upload directory:', UPLOAD_DIR); // Pour déboguer

// Ensure upload directory exists with proper permissions
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true, mode: 0o755 });
}

export const storage = {
  async saveFile(dataUrl: string, originalName: string): Promise<string> {
    try {
      // Vérifier que c'est bien une image en base64
      if (!dataUrl.startsWith('data:image/')) {
        throw new Error('Invalid image format');
      }

      // Extraire les données base64
      const matches = dataUrl.match(
        /^data:image\/([A-Za-z-+\/]+);base64,(.+)$/
      );
      if (!matches) {
        throw new Error('Invalid image data URL');
      }

      const imageData = matches[2];
      const buffer = Buffer.from(imageData, 'base64');

      // Générer un nom de fichier unique
      const fileName = `${uuidv4()}.png`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      // Sauvegarder le fichier
      await fs.promises.writeFile(filePath, buffer);

      // Vérifications
      await fs.promises.access(filePath, fs.constants.R_OK);
      const stats = await fs.promises.stat(filePath);
      console.log('File saved:', {
        path: filePath,
        size: stats.size,
        permissions: stats.mode.toString(8),
      });

      return `${config.apiUrl}/uploads/${fileName}`;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  },
};
