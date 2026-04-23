# Отборочное задание Evercodelab 

Тестовое задание для отбора в Evercodelab.

## О проекте

Это проект на Node.js, где реализовано:

1. инициализация Node.js проекта через npm
2. модуль `config.js` для хранения настроек приложения
3. модуль `logger.js` для форматированного вывода сообщений в консоль
4. файл `scheduler.js` для управления периодическими задачами

## Описание файлов

### `src/config.js`

Хранит настройки приложения.

### `src/logger.js`

Содержит функцию `createLogger(appName)` которая создает логгер для форматированного вывода сообщений в консоль.

```text
[Evercodelab Internship] app started
```

### `src/index.js`

Точка входа в приложение.

### `src/scheduler.js`

Содержит синхронный инициализирующий скрипт с логированием запуска файла, функцию scheduleTask(name, interval, task) для управления периодическими задачами, валидацию входных параметров и задачу, которая каждые 10 секунд выводит "running".

## Запуск

### Запуск основного приложения

```bash
npm start
```

Выводом будет: 

```text
[Evercodelab Internship] app started
```

### Запуск scheduler

```bash
npm run scheduler
```

Выводом будет: 

```text
[Evercodelab Internship] scheduler.js started
[Evercodelab Internship] running
```

"running" соответственно каждые 10 секунд.
