const { createReadStream } = require('fs');
const { join } = require('path');

createReadStream(join(__dirname, 'text.txt'), 'utf-8').on('data', console.log);
