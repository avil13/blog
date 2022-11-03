---
layout: base
tags: [post, 2k22, server, orange pi]
title: Настройка домашнего Transmission сервера на Orange PI
description: Настройка домашнего Transmission сервера на Orange PI
date: 2022-10-16
---

# Настройка домашнего Transmission сервера на Orange PI

В данной статье опишу то как я настраивал домашний сервер, который настроен загрузки торрентов через `transmission`.

И так, у меня миникомпьютер модели Orange Pi 3 LTS. Решил не заморачиваться и пойти стандартным путём скачав ОС с сайта [https://www.armbian.com/](https://www.armbian.com/).

Большой плюс этой ОС то что из коробки есть программа для установки полезных пакетов - `armbian-config`.

# Прелюдия. Настройка ssh

Скачали образ, если вы на винде, то можно использовать программу `rufus` что бы записать этот образ на MicroSD карточку.
Затем вставляем эту карту в Orange PI. Я подключил PI через провод к своему роутеру, и подал сеть через блок питания от телефона на 5A.

После этого, находим IP адрес нашего PI-компа в локальной сетке. Можно через админку роутера, можно через стороннюю программу IP Scanera'а.

Что бы не запоминать адрес IP компьютера, я в файле `/etc/hosts` прописываю алиас на него, что бы далее было проще подключаться.
У меня это `pi.loc`, если вы этого не сделали, то в описании ниже вместо `pi.loc` - подставляйте IP который нашли шагом ранее.
В windows путь до этого файла такой `C:\Windows\System32\drivers\etc\hosts`.

```
# ip            # host
192.168.1.177   pi.loc
```

Теперь заходим на мини комп по `ssh`.

```bash
ssh root@pi.loc
```
Если Вас спросят пароль, то это будет `1234` и сразу же его предложат поменять на что то более надёжное. Не пренебрегайте этим предложением.

И так же предложат создать нового пользователя. Я выбрал имя `pi`.

После авторизации обновляем установленные пакеты.

```bash
apt update
apt upgrade
```
После этого, возможно попросят перезагрузить компьютер. Для этого нужно ввести команду `reboot` и после снова войти по `ssh`.

## Запрет входа для root

В дополнение, напишу что лучше запретить авторизацию по `ssh` для `root` пользователя.

Что бы запретить руту авторизоваться открываем на редактирование конфиг `/etc/ssh/sshd_config` и находим строку `PermitRootLogin` и ставим ей значение `no`.

Ещё выставим `PubkeyAuthentication yes`. Что бы можно было входить по ключу.

Затем перезагружаем ssh-демон командой:

```bash
systemctl restart sshd
```

Теперь вы сможете авторизоваться только под обычным пользователем, которого система предложила вам создать на старте. У меня это `pi`, поэтому у меня вход будет через такую команду:

```bash
ssh pi@pi.loc
```

## Вход по ssh ключу вместо пароля

Ещё, хорошей практикой, можно назвать авторизацию по ключу вместо ввода пароля.


Копируем публичный ключ из вашей домашней директории, на компе, не на Pi.
Он находится по пути `~/.ssh` и заканчивается на расширение `.pub`, например `id_rsa.pub`.

Теперь авторизовавшить по `ssh` под пользователем `pi`, создаём файл с хранилищем ключей для авторизации по адресу `~/.ssh/authorized_keys`

```bash
mkdir ~/.ssh # создаём папку если ее не было до тоо
cd ~/.ssh    # заходим
# создаём файл где будут храниться публичные ключи
# записываем в него ранее скопированный публичный ключ
vim authorized_keys
```
Теперь можно будет входить по ssh не вводя пароль.

Если для безопасности вам надо отключить вход по паролю, то в файле `/etc/ssh/sshd_config` пишем или исправляем такую строку.
```
PasswordAuthentication no
```
И перезагружаем ssh-демон.
```bash
systemctl restart sshd
```

Такое действие делают на серверах, что бы хакеры через подбор не взломали ваш ssh.

---

# armbian-config

Теперь поставим программы которые предлагает `armbian`

Вводим команду

```bash
armbian-config
```
![armbian-config](/assets/images/01-home-pi.webp)

В окне, выбираем `Software`, `Softy` и для начала ставим галочки возле `transmission` и `docker`.

![armbian-config-softy](/assets/images/02-home-pi.webp)

Ещё почему то не установился `docker-compose`, поэтому ставим его руками:

```bash
sudo apt install docker-compose
```

Подготовка - закончена.

# Transmission-cli

Для начала разберёмся с демоном `transmission` - который будет автоматически скачивать торренты которые мы ему будем давать.

transmission - для работы использует несколько подпрограмм:

- transmission-daemon - демон который работает в фоне
- transmission-cli    - интерфейс командной строки для управления
- transmission-remote - интерфейс для управления

Настроим демон.

Добавляем демон, и ставим ему автостарт.
После проверяем что все включилось.

```bash
sudo /etc/init.d/transmission-daemon start
sudo update-rc.d transmission-daemon defaults
sudo service --status-all
```

Если не было, он создаст папку `/etc/transmission-daemon` в которой нас сейчас интересует файл `settings.json`.

Поправим там несколько значений.

Добавим список IP в блоклист, что бы не подцепить вирус.

```json
"blocklist-enabled": true,
"blocklist-url": "http://list.iblocklist.com/?list=ydxerpxkpcfqjaybcssw&fileformat=p2p&archiveformat=gz",
```

Папка куда будут сохраняться торренты

```json
"download-dir": "/home/pi/Download/torrent",
"incomplete-dir": "/home/pi/Download/torrent/incomplete",
"incomplete-dir-enabled": true,
```

Папка которая будет следить за появлением новых торрент файлов

```json
"watch-dir": "/home/pi/Download/src",
"watch-dir-enabled": true,
```

Если надо, добавляем логин и пароль. Пароль будет зашифрован при перезапуске.

```json
"rpc-authentication-required": true,
"rpc-username": "pi",
"rpc-password": "secret",
"rpc-whitelist-enabled": false,
```
- `rpc-whitelist-enabled` - тут аккуратнее, настройка нужна если хост не проходит

Рестартуем демон.

```bash
sudo service transmission-daemon restart
```

И маленький нюанс, если порт не менять, то адрес в веб интерфейсе при запуске будет:

`http://pi.loc:9091/transmission/web/` - слеш на конце __обязателен__!

# Heimdall

`Heimdall` - это доска со списком ссылок на ваши приложения. Написан на PHP потому практически не жрёт память.

Для начала делаем папку для конфига и заходим в неё.

```bash
mkdir ~/heimdall
cd ~/heimdall
```
Создаём файл `docker-compose.yml` - с вот таким содержанием:

```yml
version: '3'
services:
  heimdall:
    image: linuxserver/heimdall:latest
    container_name: heimdall
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Moscow
    volumes:
      - ./config:/config
    # Список портов через которые будет доступен интерфейс в браузере
    ports:
      - 80:80
      - 443:443
    # Контейнер будет автоматически рестартовать, до тех пор пока вы не отсанвите его вручную
    restart: unless-stopped
```

Стартуем контейнер:

```bash
sudo docker-compose up -d
```

Если все прошло успешно, поздравляю. Теперь вы можете в браузере набрать `http://pi.loc` (Об этом адресе я писал выше, это алиас на IP мини-компа).

![heimdall](/assets/images/03-home-pi.webp)

## Добавление ссылок на приложения

Нажав на ссылку `Add an application here`, ставим `Transmission` выбрав его в списке приложений.

Кликаем на `Application type` и в выпадающем списке ищем `Transmission`

![heimdall-transmission](/assets/images/04-home-pi.webp)

В настройках обязательно проставьте `url` у меня я задал `http://pi.loc:9091/transmission/web/`

![heimdall-transmission-dashboard](/assets/images/05-home-pi.webp)

Теперь при клике по иконке, мы будем переходить по указанному в настройках адресу.

![transmission-web-page](/assets/images/06-home-pi.webp)

Настройка завершена.

Теперь закинув торрен в веб интерфейс можете начать скачивать файлы.

А если есть желание, то можно настроить доставку файлов в паку за которой будет следить `transmission`.
