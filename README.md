# Отборочное задание Evercodelab 

Проект на Node.js в рамках курса "Бэкенд-разработка на Node.js" в Evercodelab.

## О проекте

Это проект на Node.js, где реализовано:

1. Express web server
2. маршрут `/status` для проверки работы сервера
3. авторизация через Bearer token из `.env`
4. CRUD API для `currency`
5. хранение `currency` в памяти приложения (временно)
6. endpoint `/price` для получения курсов из Binance
7. retry и timeout при запросе к Binance
8. OpenAPI описание endpoint
9. структура проекта по принципу разделения ответственности
10. модуль конфигурации приложения
11. логгер с уровнями логирования
12. кастомные ошибки для удобной отладки
13. scheduler для управления периодическими задачами (локально)
14. автотесты на Jest

## Структура проекта

```text
src/config
настройки приложения

src/clients
HTTP клиент для внешних API

src/docs
OpenAPI спецификации

src/errors
кастомные ошибки 

src/http/middlewares
middleware для auth, requestId, requestLogger и ошибок

src/http/routes
Список Express routes

src/logger
кастомный logger

src/repositories
хранение данных в памяти (временно)

src/services
бизнес логика приложения

src/validators
валидация входных данных 
```

## Основные endpoints

```text
GET    /status
GET    /openapi.json

GET    /api/currencies
POST   /api/currencies
GET    /api/currencies/:ticker
PUT    /api/currencies/:ticker
DELETE /api/currencies/:ticker

GET    /price?currency=:ticker
```

## Авторизация

Все API endpoint защищены Bearer token через auth middleware.

Публичные endpoints:

```text
GET /status
GET /openapi.json
```

Защищённые endpoints:

```text
/api/currencies
/price
```

Пример заголовка:

```text
Authorization: Bearer <API_TOKEN>
```

`API_TOKEN` хранится в `.env`. Также есть пример токена в .env.example. 

## Currency API

Сущность `currency` содержит два поля:

```json
{
  "name": "Bitcoin",
  "ticker": "BTC"
}
```

Данные хранятся в памяти app временно. 
После перезапуска сервера список очищается.

## Price API

Endpoint:

```text
GET /price?currency=:ticker
```

Пример ответа:

```json
{
  "currency": "BTC",
  "prices": [
    {
      "symbol": "BTCUSDT",
      "price": "68000.00000000"
    },
    {
      "symbol": "ETHBTC",
      "price": "0.05200000"
    }
  ]
}
```

Все пары Binance, где в symbol встречается переданный ticker.

## OpenAPI

OpenAPI спецификация доступна по:

```text
GET /openapi.json
```

Описаны endpoints, методы, параметры, ответы, схемы и авторизация.

## Ошибки и логирование

Кастомные ошибки содержат:

```text
statusCode
timestamp
requestId
context
```

Логгер поддерживает уровни:

```text
error
warn
info
debug
trace
```

Пример лога:

```text
[2026-05-27T21:50:50.265Z] [INFO] [Evercodelab Internship] [requestId=44203f29-9736-4490-b718-4a5a7d280338] request started GET /price?currency=BTC
```

## Запуск

### Установка зависимостей

```bash
npm install
```

### Запуск приложения

```bash
npm start
```

Выводом будет:

```text
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] app started on port 3000
```

### Запуск scheduler

```bash
npm run scheduler
```

Выводом будет:

```text
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] [requestId=scheduler-task] scheduler started
[2026-05-20T12:30:30.529Z] [INFO] [Evercodelab Internship] [requestId=scheduler-task] background task done
```

Сообщение `background task done` выводится каждые 10 секунд.

## Тестирование

Для тестирования используется Jest.

Запуск тестов:

```bash
npm test
```

Запуск тестов с покрытием:

```bash
npm run test:coverage
```

В проекте тесты для:

```text
ошибок
logger
validators
scheduler
middlewares
currency routes
price route
services
OpenAPI route
```

## Скрипты

```json
{
  "start": "node src/index.js",
  "scheduler": "node src/scheduler.js",
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```


