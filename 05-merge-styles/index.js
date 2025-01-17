const path = require('path');
const fs = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');
const sourceStyles = path.join(__dirname, 'styles');
const bundleStyles = path.join(__dirname, 'project-dist', 'bundle.css');
const output = createWriteStream(path.join(bundleStyles));

async function createBundle() {
  try {
    const files = await fs.readdir(sourceStyles, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const input = createReadStream(
          path.join(sourceStyles, file.name),
          'utf-8',
        );
        input.pipe(output, { end: false });
        await new Promise((resolve) => input.on('end', resolve));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    output.end();
  }
}

createBundle();
