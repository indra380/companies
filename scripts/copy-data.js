const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'data', 'companies.json');
const destDir = path.join(__dirname, '..', 'public', 'data');
const dest = path.join(destDir, 'companies.json');

async function copy() {
  try {
    await fs.promises.mkdir(destDir, { recursive: true });
    await fs.promises.copyFile(src, dest);
    console.log('Copied companies.json to public/data/');
  } catch (err) {
    console.error('Error copying companies.json:', err);
    process.exit(1);
  }
}

copy();
