const path = require('path');
const fs = require('fs/promises');

const mainFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function copyDir(from, to) {
  try {
    await fs.rm(to, { recursive: true, force: true });
    await fs.mkdir(to, { recursive: true });
    const files = await fs.readdir(from, { withFileTypes: true });
    const promises = files.map((file) => {
      const source = path.join(from, file.name);
      const copied = path.join(to, file.name);
      return fs.copyFile(source, copied);
    });
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }
}

copyDir(mainFolder, copyFolder);
