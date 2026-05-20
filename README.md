# Отборочное задание Evercodelab 

Проект на Node.js в рамках курса "Бэкенд-разработка на Node.js" в Evercodelab.

## О проекте

Это проект на Node.js, где реализовано:

1. инициализация Node.js проекта через npm
2. структура проекта по принципу разделения ответственности
3. модуль конфигурации приложения
4. логгер с уровнями логирования
5. кастомные ошибки для удобной отладки
6. scheduler для управления периодическими задачами
7. автотесты на Jest

## Описание файлов

### `src/config/appConfig.js`

Хранит настройки приложения такие как название, окружение, версию, уровень логирования.

### `src/logger/logger.js`

Содержит класс `Logger` для форматированного вывода сообщений в консоль и который поддерживает уровни логирования `error`, `warn`, `info`, `debug`, `trace`, `requestId`.

Пример вывода:

```text
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] app started
```

### `src/errors`

Содержит ошибки приложения:

1. `AppError`
2. `ValidationError`
3. `ConfigError`
4. `SchedulerError`

Наследуются от стандартного `Error` и содержат доп. поля: `statusCode`, `timestamp`, `requestId`, `context`.

### `src/validators/taskValidator.js`

Проверяет параметры задачи перед запуском scheduler, если неправильные то выбрасывается `ValidationError`.

### `src/scheduler/scheduleTask.js`

Содержит функцию `scheduleTask(name, interval, task)`. Проверяет параметры задачи и запускает её через `setInterval`.

### `src/scheduler/startScheduler.js`

Запускает конкретную периодическую задачу приложения. Logger передаётся в этот модуль через dependencies.

### `src/index.js`

Точка входа в приложение.

### `src/scheduler.js`

Точка входа для запуска scheduler.

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
[2026-05-20T12:30:20.529Z] [INFO] [Evercodelab Internship] app started
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
Остановить с помощью Ctrl + C. 

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
taskValidator
logger
scheduler
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


