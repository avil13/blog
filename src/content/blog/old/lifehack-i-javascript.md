---
seo:
  tags: [post, old]
  title: Лайфхак и JavaScript
  description: Способ немного упростить работу в браузере при помощи JavaScript
  date: 2015-09-29
  image: /images/graph/blog/js-live-hack.webp
hero:
  src: /images/graph/blog/js-live-hack.webp
  alt: Лайфхакер и JavaScript
---

# Лайфхак и JavaScript

Не редко приходится исправлять что то на странице, при чем ни только в целях вызванных рабочим процессом.

К примеру иногда нужно что то написать, а стикера под рукой нет.
Или хочется что то подправить в контенте на странице, а лезть в DevTools браузера лень.

Как раз для таких целей я и использую несколько своих "лайфхаков".


***

### Начнём с редактирования текста на странице.

К примеру нужно поменять заголовок в новости без лишних телодвижений.

создаём новую ссылку в закладках браузера.

В поле `URL` пишем в одну строку вот этот код:

```js
javascript: document.body.contentEditable = (document.body.contentEditable==='true')? false : true;
```

Ну и обзываем эту ссылку как нибудь. Лично я поставил симпатичную иконку: "✍"

Кликнув по этой ссылке один раз, мы делаем текст на странице редактируемым, а кликнув второй раз мы снова делаем страницу просто читабельной.


### Создание полностью редактируемой страницы

Бывает такое что нужно срочно сохранить текст, а открывать редактор долго.

В такие моменты я пользуюсь ещё одной ссылкой, создаётся она по тому же методу что и описанная ранеё.

создаёте ссылку и в поле `URL` пишете код:

```js
javascript:window.open('data:text/html,<html contenteditable style="background-color:#444;padding: 30px 9%;color:#46DD4C;font-family:sans-serif;">', '_blank');
```
Вид этой ссылке я оформил в виде вот такого значка: "✎"

Теперь, кликнув по этой ссылке, у вас откроется новая вкладка браузера, которая полностью доступна для редактирования и прямо в ней можно писать текст.

### Использование сниппета console.save для DevTools

Часто отлаживая сложные объекты в JavaScript их необходимо сохранить, для проверки. Тогда я использую сниппет `console.save` для сохранения объекта в файл.
Выглядит этот сниппет вот так:

```js
(function(console){
  console.save = function(data, filename){
    if(!data) {
      console.error('Console.save: No data')
      return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
      data = JSON.stringify(data, undefined, 4 )
    }

    var blob = new Blob([data], {type: 'text/json'}),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  }
})(console)
```

Проблема только в том, что для его использования нужно ввести этот код в консоль DevTools.

Что бы облегчить себе жизнь, я создал вот такую закладку которая мгновенно выполняет эту работу.

```js
javascript:!function(e){e.save=function(o,n){if(!o)return void e.error("Console.save: No data");n||(n="console.json"),"object"==typeof o&&(o=JSON.stringify(o,void 0,4));var t=new Blob([o],{type:"text/json"}),a=document.createEvent("MouseEvents"),d=document.createElement("a");d.download=n,d.href=window.URL.createObjectURL(t),d.dataset.downloadurl=["text/json",d.download,d.href].join(":"),a.initMouseEvent("click",!0,!1,window,0,0,0,0,0,!1,!1,!1,!1,0,null),d.dispatchEvent(a)}}(console);
```

И для этой закладки присвоил вот такую иконку: "💾"


Теперь, этот сниппет всегда у меня под рукой.


***

В итоге эти мини закладки выглядят вот так на панели

![](/images/blog/img/links1.png)

И вот так я их создавал в диспетчере закладок

![](/images/blog/img/links2.png)

Все иконки, это символы шрифтов и добавить себе их можно просто скопировав.
