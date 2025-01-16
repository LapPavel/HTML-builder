const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folder, file.name);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        const { name, ext } = path.parse(filePath);
        console.log(
          `${name} - ${ext.slice(1)} - ${(stats.size / 1024).toFixed(2)} kb`,
        );
      });
    }
  });
});
