var fs = require('fs');
fs.createReadStream('.nojekyll').pipe(fs.createWriteStream('docs/.nojekyll'));
