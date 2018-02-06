const crypto = require('crypto');
crypto.randomBytes(21, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});