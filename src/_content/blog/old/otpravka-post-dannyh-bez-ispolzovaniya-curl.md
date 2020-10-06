---
layout: base
tags: [post, old]
title: Отправка POST данных без использования CURL
date: 2015-06-25
---

# Отправка POST данных без использования CURL

Поставим задачу так: не используя CURL при помощи php необходимо отправить данные и получить ответ.

На помощь нам придёт функция `file_get_contents()`.

```php
$options = ['http' =>
  [
    'method'  => 'POST',
    'header'  => 'Content-type: application/x-www-form-urlencoded',
    'content' => http_build_query([
                                  'var1' => 'Первая переменная',
                                  'var2' => 'Вторая переменная'
                                ])
  ]
];

$context  = stream_context_create($options);

$result = file_get_contents('http://test.ru/submit.php', false, $context);

```

В переменной `$result` будет храниться строка с ответом полученным от сервера.
