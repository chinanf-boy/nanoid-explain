# nanoid

用于JavaScript的小型（176字节），安全的，URL友好的，唯一的字符串ID生成器。

[![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/Source-Explain)
    
Explanation

> "version": "1.0.0"

[github source](https://github.com/ai/nanoid)

~~[english](./README.en.md)~~

---

[网上玩弄-nanoid 找出id复杂度](https://github.com/Alex7Kom/nano-nanoid-cc)

---

## 目录

- [使用与尝试](#使用与尝试)

- [index.js 默认导出](#index)

- [random > node内置生成加密强伪随机数据](#random)

- [random-browser > 浏览器版本的生成加密强伪随机数据](#random-browser)

- [generate > 自己定义-规定字符-与长度](#generate)

- [format > 改变底层random函数 和 自己定义-规定字符-与长度](#format)

---

## 使用与尝试

``` js
var nanoid = require('nanoid')
model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqLJ"
```

| 试试👌 - ·yarn· ·npm·

[`node try-nanoid.js`](./try-nanoid.js)

## index

代码 1-3

``` js
var random = require('./random')
var url = '_~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

```

代码 21-29

``` js
module.exports = function (size) { // == nanoid()
  size = size || 21 // 默认 21位
  var id = ''
  var bytes = random(size) // 
  while (0 < size--) { // 逐个随机
    id += url[bytes[size] & 63] //  从 url 数组中选择
  }
  return id
}
```

- & 

``` js
1 & 63
// 1
100 & 63
// 36
```

- [random(size)](#random)

> 生成加密强伪随机数据. size参数是指示要生成的字节数的数值。


## random

``` js
module.exports = require('crypto').randomBytes // 引用
```

| 详细文档🔎

`crypto.randomBytes(size[, callback]) >> `[nodejs.cn文档](http://nodejs.cn/api/crypto.html#crypto_crypto_randombytes_size_callback)

| 试试👌

[`node try-crypto.js`](./try-crypto.js)

| 简要说明📖

1. 如果提供 `callback` 回调函数,是`异步`生成的并且使用两个参数调用`callback`函数：`err`和`buf`

``` js
// Asynchronous
const crypto = require('crypto');
crypto.randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```

2. 如果未提供 callback回调函数, 则`同步`地生成随机字节并返回为Buffer。
 
``` js
// Synchronous 
const buf = crypto.randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```

---

|

当然nanoid 不仅可以用于`node`，还有`browser`

这就需要，browser <- `random-browser.js` 替换 node <- `const crypto = require('crypto');`

|

---

## random-browser

浏览器版本的-random

``` js
var crypto = window.crypto || window.msCrypto

module.exports = function (bytes) {
  return crypto.getRandomValues(new Uint8Array(bytes))
}

```

可以从 -package.json- 看出端疑 

``` json
  "browser": {
    "./random.js": "./random-browser.js" // 重导向
  },
```

---

## generate

generate.js

``` js
var random = require('./random')
var format = require('./format')
```

``` js
module.exports = function (alphabet, size) {
    // 底层random, 自己定义的 
    // alphabet 字符集
    // size id 长度
  return format(random, alphabet, size) // 看来主角是-format
}

```



---

起示例-来看看 `format`

``` js
var format = require('nanoid/format')

function random (size) {
  var result = []
  for (var i = 0; i < size; i++) result.push(randomByte())
  // randomByte() ??? 需要自己编写
  return result
}

format(random, "abcdef", 10) 
```

## format

format.js 可以改变底层->关于[`random`函数](#random)定义


``` js
module.exports = function (random, alphabet, size) {
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1 // mask==7  alphabet == "abcdef"
  var step = Math.ceil(1.6 * mask * size / alphabet.length)
 // step == 19  size == 10
  var id = ''
  while (true) {    // 随机到的字符 不一定在范围:alphabet 内
  // 循环♻️
    var bytes = random(step) // 启动自己编写的随机函数 或者 原生
    for (var i = 0; i < step; i++) {
      var byte = bytes[i] & mask // 控制占位
      if (alphabet[byte]) { // 是否在规定的字符范围
        id += alphabet[byte] // 加入
        if (id.length === size) return id // 到底限定-长度
        // 返回，退出循环♻️
      }
    }
  }
}
```

