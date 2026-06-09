# Отборочное задание Evercodelab 

Проект на Node.js в рамках курса "Бэкенд-разработка на Node.js" в Evercodelab.

## О проекте

Это проект на Node.js, где реализовано:

1. Express web server
2. маршрут `/status` для проверки работы сервера
3. авторизация через Bearer token из `.env`
4. CRUD API для `currency`
5. хранение `currency` в SQLite базе данных
6. endpoint `/price` для получения сохранённых курсов из SQLite, где курсы берутся автоматически раз в минуту с помощью scheduler
7. retry и timeout при запросе к Binance
8. OpenAPI описание endpoint
9. структура проекта по принципу разделения ответственности
10. модуль конфигурации приложения
11. логгер с уровнями логирования
12. кастомные ошибки для удобной отладки
13. scheduler для управления периодическими задачами (локально)
14. автотесты на Jest
15. Repository Pattern для работы с данными
16. транзакции для write операций в SQLite


## Структура проекта

```text
src/config
настройки приложения

src/clients
HTTP клиент для внешних API

src/database
подключение SQLite, схема базы данных, транзакции и инициализация базы

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
слой доступа к данным через Repository Pattern

src/services
бизнес логика приложения

src/validators
валидация входных данных 

testUtils
helper функции для тестовой SQLite базы и тестового приложения
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

Данные хранятся в SQLite базе данных.

После перезапуска сервера список `currency` сохраняется.

## Price API

Endpoint:

```text
GET /price?currency=:ticker
```

Возвращает сохраненные курсы из SQLite бд, не обращается напрямую к Binance, а курсы обновляются фоновой задачей раз в 1 минуту. Scheduler обращается к Binance API и сохраняет в бд.

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

Перед чтением курсов приложение проверяет, что переданный `currency` есть в базе данных.

Если курсы ещё не были обновлены scheduler, endpoint вернёт пустой массив `prices`.

## Работа с базой данных

В проекте используется SQLite.

По умолчанию база создаётся по пути:

```text
./data/app.sqlite
```

Файл базы данных не хранится в репозитории.

В базе хранятся `currency` и сохранённые курсы для `/price`, а также информация когда список был обновлен в последний раз в рамках scheduler. 

Для создания базы и таблиц используется команда:

```bash
npm run db:init
```

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
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] [requestId=scheduler-task] scheduler started
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] [requestId=scheduler-task] price update started
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] app started on port 3000
```

(Вместе со стартом запускается и фоновое обновление price раз в 1 минуту)

### Инициализация базы данных

```bash
npm run db:init
```

### Запуск scheduler

```bash
npm run scheduler
```

(запускает только scheduler без старта Express сервера)

Выводом будет:

```text
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] [requestId=scheduler-task] scheduler started
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] [requestId=scheduler-task] price update started
[2026-05-20T12:30:26.529Z] [INFO] [Evercodelab Internship] [requestId=scheduler-task] price update done: currencies=1, prices=531, durationMs=6000
```

Scheduler обновляет курсы раз в минуту.

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
database
currency routes
price route
services
OpenAPI route
```

для тестов используется временная база данных SQLite. 

## Скрипты

```json
{
  "start": "node src/index.js",
  "scheduler": "node src/scheduler.js",
  "db:init": "node src/database/initDatabase.js",
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```


