var nanoid = require('nanoid')

// default
console.log('** default use **')
console.log(nanoid(),'\n')

//  generate

var generate = require('nanoid/generate')
console.log('** generate with length {10} use **')

console.log(generate('1234567890abcdef', 10),'\n')

// format

var format = require('nanoid/format')
var randomByte = require('nanoid/random')


function random (size) {
  var result = []
  for (var i = 0; i < size; i++) result.push(randomByte(size))
  return result
}
console.log('** format with {-function-} use **')

console.log(format(random, "abcdef", 10))

// url

var url = require('nanoid/url')
console.log('** format with {url} use **')

console.log(format(random, url, 10))