const upload = require('./src/middlewares/multerConfig');

console.log('upload:', typeof upload);
console.log('upload.single:', typeof upload.single);
