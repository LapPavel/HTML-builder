const { createWriteStream } = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const textStream = createWriteStream(path.join(__dirname, 'text.txt'));

const exit = () => {
  stdout.write('\nBy! Have a nice day!');
  process.exit();
};

stdout.write('Hello! Put your text here:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  } else {
    textStream.write(data);
  }
});

process.on('SIGINT', exit);
