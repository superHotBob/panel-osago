# MUST Insurance
> Виджеты для проектов mustins.ru, построенных на [Tilda](https://tilda.cc/)

## Требования
 
- NodeJs версии 10 и выше
- Docker (для production сборки проекта)

## Локальная разработка

0. Установите зависимости
```bash
npm install
```

1. Запустите проект
```bash
npm run dev
```

> Проект доступен по адресу http://localhost:9003


## Production сборка (локально)

Для сборки проекта под Tilda необходимо собрать 
контейнер и затем запустить его:

```
docker build -t mustins-docker ./
docker run -p 9001:80 mustins-docker
```

После чего файл по адресу http://localhost:9001/osago-loader.js
можно использовать для активации виджетов в тильде.

## Инструкция по установке виджета на сайт партнера

Партнеру необходимо разместить у себя на странице контейнер виджета MUST Insurance
```
<div id="must-eosago-insurance-partner-widget"></div>
```

А ниже вставить скрипт
```
<script type="text/javascript">
  (function (document) {
    var tag = 'script';
    var el = document.createElement(tag)
    var bs = document.getElementsByTagName(tag)[0]
    el.src = 'https://osago-k8s.stage.mustins.ru/partner-loader.js?' + new Date().getTime()
    el.onload = function () {
      mustins({
        selector: '#must-eosago-insurance-partner-widget',
        ym: '52986040',
        source: '1111-1111-1111'
     })
    }
    bs.parentNode.insertBefore(el, bs);
  })(document);
</script>
```


Эту часть партнер может настроить самостоятельно
```
mustins({
  selector: '#must-eosago-insurance-partner-widget',
  ym: '52986040',
  source: '1111-1111-1111'
})

``` 
**selector** - это селектор для контейнера виджета  
**ym** - это номер счетчика яндекс метрики партнера  
**source** - id, который необходимо получить от разработчиков api, чтобы в битриксе правильно проставлялся источник сделки


## Виджеты

### InsuranceForm
Виджет для оформления полиса осаго.  
Используется на странице https://osago.mustins.ru/  
✅ &nbsp;&nbsp; проведен рефакторинг

### MustHeader  
Используется на всех страницах https://osago.mustins.ru/ и  https://mustins.ru/  

### MustAccident
Виджет для https://accident.mustins.ru/  
Включает в себя страницы расчета вероятности дтп, профиль, историю запросов, а также хедер.

### PhoneWidget
Виджет для сбора телефонных номеров  
Используется на странице https://osago.mustins.ru/  

### EmailWidget
Виджет для сбора email  
Используется на странице https://osago.mustins.ru/

### ReconstructionWidget
Виджет для сбора email  
Используется на страницах https://mustins.ru/liability https://mustins.ru/injury https://mustins.ru/cargo https://mustins.ru/prodrive

### Profile
Виджет редактирования данных пользователя   
Используется на страницах https://osago.mustins.ru/profile и  https://mustins.ru/profile  

## Компоненты

### Modal
Попап  
✅ &nbsp;&nbsp; проведен рефакторинг

### Форма регистрации/авторизации
✅ &nbsp;&nbsp; проведен рефакторинг

### Phone number
Поле ввода номера телефона  
✅ &nbsp;&nbsp; проведен рефакторинг


