import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputRoot = 'C:/Users/HP/Desktop/PROPERTY/DUCHESS HOMES';
const outputRoot = 'C:/Users/HP/Desktop/PROPERTY/DUCHESS HOMES WEBP';

function convertImagesInFolder(currentInputPath: string, currentOutputPath: string): void {
  fs.mkdirSync(currentOutputPath, { recursive: true });

  const entries = fs.readdirSync(currentInputPath, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(currentInputPath, entry.name);
    const outputPath = path.join(currentOutputPath, entry.name);

    if (entry.isDirectory()) {
      convertImagesInFolder(inputPath, outputPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const baseName = path.basename(entry.name, ext);

      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const webpOutput = path.join(currentOutputPath, baseName + '.webp');

        sharp(inputPath)
          .webp({ quality: 75 })
          .toFile(webpOutput)
          .then(() => console.log(`✅ Converted: ${inputPath}`))
          .catch(err => console.error(`❌ Error: ${inputPath}`, err));
      }
    }
  }
}

convertImagesInFolder(inputRoot, outputRoot);
