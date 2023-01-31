---
layout: '../../../layouts/Layout.astro'
seo:
  title: Отправка POST данных через PHP без использования CURL
  description: Нативный PHP, старый трюк с созданием реквеста
  date: 2015-06-25
  image: /images/graph/blog/post-php.webp
hero:
  src: /images/graph/blog/post-php.webp
  alt: Отправка в PHP POST данных без использования CURL

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
