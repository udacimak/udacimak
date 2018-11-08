const fs = require('fs');


export default function readFileSync(path) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (error) {
    throw error;
  }
}
