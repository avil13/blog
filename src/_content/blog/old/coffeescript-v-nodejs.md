---
layout: base
tags: [post, old]
title: coffeescript в node.js
---

# coffeescript в node.js

coffescript мне очень нравится, так как синтаксис всеми нами любимого JavaScrip делает более удобным для чтения и понимания. Хотя это и всего лишь синтаксический сахар, но он действительно способен облегчить жизнь.

Используя `node.js` так же можно использовать и `coffeescript` для этого устанавливаем пакет

```bash
npm install coffee-script
```
и запускаем выполнение наших coffee скриптов на ноде.

Но не всегда удобно писать все через команду `coffee`. В такие моменты можно воспользоваться лайфхаком от разработчиков.

Уже установив `coffee-script` создаем для нашего примера два файла: `index.js` и `scripts.coffee`.

В `script.coffee` пишем для проверки

```coffeescript

console.log 'Cup of coffee pleas!'
```

В `index.js` пишем

```javascript

// подключаем интерпритатор coffeescript он стал доступен с версии 1.7.*
require('coffee-script/register');
// подключаем наш coffee файл
require('./script.coffee');
```

Теперь запускаем наш `node.js` скрипт

`node index.js`

И в консоли выведется текст `Cup of coffee pleas!` так как он интерпретирован из coffee файла без каких либо сложных жонглирований и манипуляций с параметрами.