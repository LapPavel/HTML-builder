const path = require('path');
const fs = require('fs/promises');
const { createWriteStream, createReadStream } = require('fs');

const projectFolder = path.join(__dirname, 'project-dist');
const sourceStyles = path.join(__dirname, 'styles');
const bundleStyles = path.join(__dirname, 'project-dist', 'style.css');
const templateHtml = path.join(__dirname, 'template.html');
const partsHtml = path.join(__dirname, 'components');

async function copyDir(from, to) {
  try {
    await fs.mkdir(to, { recursive: true });
    const elements = await fs.readdir(from, { withFileTypes: true });
    const promises = elements.map(async (element) => {
      const source = path.join(from, element.name);
      const copied = path.join(to, element.name);
      if (element.isDirectory()) {
        await copyDir(source, copied);
      } else {
        await fs.copyFile(source, copied);
      }
    });
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  }
}

async function createBundle() {
  const output = createWriteStream(bundleStyles);
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

async function buildHtml() {
  let html = await fs.readFile(templateHtml, 'utf8');
  const templates = [...html.matchAll(/{{(.*)}}/g)];
  for (const template of templates) {
    const replacePath = path.join(partsHtml, `${template[1]}.html`);
    const replaceHtml = await fs.readFile(replacePath, 'utf8');
    html = html.replace(template[0], replaceHtml);
  }
  await fs.writeFile(path.join(projectFolder, 'index.html'), html, 'utf8');
}

(async () => {
  try {
    await fs.rm(projectFolder, { recursive: true, force: true });
    await fs.mkdir(projectFolder, { recursive: true });
    await Promise.all([
      copyDir(
        path.join(__dirname, 'assets'),
        path.join(projectFolder, 'assets'),
      ),
      createBundle(),
      buildHtml(),
    ]);
  } catch (err) {
    console.error(err);
  }
})();
