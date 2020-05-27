---
layout: base
tags: [post, old]
title: Преобразование даты в Eloquent
---

# Преобразование даты в Eloquent

И так. У меня сервер который работает на php5.6 + PostreSQL в качестве базы данных. Все это используется сайтом созданным на Laravel 4.2.

И мне понадобилось преобразовывать дату в другой формат, ибо время в БД сохраняется по Гринвичу.

Предположим что колонка с датой у нас называется `Moment`

Если из БД брать данные через SQL то можно использовать прямой запрос с функцией timezone

```sql
SELECT timezone('UTC', "Moment") AS "Moment" FROM table_name
```

Но так как мы используем Laravel, и соответственно, для работы с БД его ОРМ Eloquent, то будем использовать его модели для преобразования даты.

#### Для начала создадим отдельно функцию которую будем вызывать для преобразования даты, что бы везде на сайте даты выглядели одинаково.

Добавим файл с набором наших собственных функций хелперов.
От корня сайта путь к нему будет выглядеть вот так: `app/Acme/helpers.php`.

Затем в файле `composer.json` пропишем его в автолоад

```json
"autoload": {
        "classmap": [
            "app/commands",
            "app/controllers",
            "app/models",
            "app/database/migrations",
            "app/database/seeds",
            "app/tests/TestCase.php"
        ],
        "files": ["app/Acme/helpers.php"],
        "psr-4": {
            "Acme\\": "app/Acme"
        }
    }
```

Тут мы добавили строки `files` и `psr-4`.

Теперь с консоли выполняем `composer dump-autoload` либо  `php artisan dump-autoload` для того что бы подгрузить все что указано в этом участке файла.

Теперь непосредственно к функции для преобразования даты в нашем файле `helpers.php`.


```php
<?php
use Carbon\Carbon;

/**
 * Приведение к нужному формату времени
 * @param  [type] $value [description]
 * @return [type]        [description]
 */
function toDate($value){
    // если получили пустое значение, то вернем его же.
    if(empty($value)){
        return $value;
    }
    // на случай если передадим объект Carbon
    if( is_object($value)){
        return $value->timezone('Europe/Moscow')->toDateTimeString();
    }
    // Если получили строку со временем и датой
    return Carbon::createFromTimestamp(strtotime($value))
        ->timezone('Europe/Moscow')
        ->toDateTimeString();
}

```



Ну и для ясности изложения файл модели для связи с таблицей БД у нас будет `Messages.php`.

```php
<?php

class Messages extends Eloquent {

    public $timestamps = false;
    protected $table = 'Messages';
}
```


### Первый вариант решения, мутатор getMomentAttribute.

Первый и самый простой вариант, это использовать [мутатор](http://laravel.com/docs/4.2/eloquent#accessors-and-mutators) атрибутов класса.

Его нужно прописать в `Messages.php`, он выглядит примерно так.

```php
public function getMomentAttribute($value) {
    return toDate($value);
}
```

В названии функции нужно указать как называется столбец который нужно преобразовать.

В случае если название столбца в вашей БД выглядит вот так `create_time` то его название в имени функции будет выглядеть `CreateTime`, а название самой функции `getCreateTimeAttribute`.

В принципе, в большинстве случаев данного действия должно хватить для преобразования. Таким же способом можно изменять и любые другие элементы получаемые в модель.



### Второй вариант решения, преобразование даты.

Так же можно использовать и вариант с преобразованием даты.

Для этого, в файле `Messages.php` нужно указать какие поля считать датами.

```php
public $dates = ['Moment'];
```

Далее можно использовать функцию описания формата даты который получаем из БД.

```php
protected function getDateFormat()
{
    return 'Y-m-d H:i:s';
}
```

Меня правда как то удивило то что в файле для преобразования даты, она возвращается в том же виде в каком и передали.

`vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php`

В функции `fromDateTime` в строке 2644 возвращается текст отформатированный из исходного вида.
Не очень понял логику этого решения, если вы более проницательны, то поделитесь.

У меня БД возвращала строку с датой такого вида `2015-02-03 07:52:43.812659` поэтому нормально вышеуказанная функция не работала.

Так что был сделан такой хак.

В файле `Messages.php` добавлена функция:

```php
protected function asDateTime($value){
    // преобразовываем значение в  DateTime
    $value = strtotime($value);
    // получаем объект Cabon для последующего преобразования
    $obj =  parent::asDateTime($value);
    // преобразовываем
    return toDate($obj);
}
```

Из нюансов, хотелось бы отметить то что в функции `asDateTime` не обязательно создавать объект, так же как и в функции хелпере.
Просто мне так удобнее потому что все преобразования можно легко абстрагировать от основной работы.