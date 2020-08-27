# Обзор

Steroids for React - это фреймворк, созданный для создания сложных и гибких SPA приложений на React.

Используя традиционные библиотеки, мы создали экосистему с продуманной архитектурой, в которой уже есть роутинг, авторизация,
локализация, формы, списки, работа с бекендом, хранилищем и так далее. Это позволяет сделать старт проекта максимально быстрым.


## Ключевые особенности

- Продуманная архитектура, подходящая под большинство проектов;
- Набор UI компонентов для создания ERP веб-приложений;
- Компоненты разделены на "core" и "view" части, что дает возможность изменять не только стили, но и верстку (jsx);
- Использование заранее описанных мета-данных сущностей;
- Код написан на TypeScript с описанием типов;


## Используемые зависимости

"Под капотом" мы используем наиболее привычные библиотеки для более быстрого погружения разработчика:

- [react](https://www.npmjs.com/package/react)
- [redux](https://www.npmjs.com/package/redux)
- [history](https://www.npmjs.com/package/history)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [redux-form](https://www.npmjs.com/package/redux-form)
- [axios](https://www.npmjs.com/package/axios)
- [draft-js](https://www.npmjs.com/package/draft-js)
- [lodash](https://www.npmjs.com/package/lodash)
- [moment](https://www.npmjs.com/package/moment)
- [webpack](https://www.npmjs.com/package/webpack)
- [babel](https://www.npmjs.com/package/babel)
- [storybook](https://www.npmjs.com/package/storybook)


## Поддерживаемые окружения

- Все современные desktop и мобильные браузеры
- Рендеринг на сервере (SSR)
- Electron

Поддержка более старых браузеров осуществляется через полифиллы (polyfills) и настраивается через `@babel/preset-env`.


## Установка

Используйте созданный нами шаблон приложения (boilerplate) для создания проекта: 
https://github.com/steroids/boilerplate-react

Или установите пакеты с помощью `npm` или `yarn`:

```sh
yarn add @steroidsjs/core @steroidsjs/bootstrap @steroidsjs/webpack
```


## Ссылки

- [Начало работы](getting-started.md)
- [Архитектура проекта](project-architecture.md)
- [Архитектура UI компонентов](ui-architecture.md)
- [Роутинг](routes.md)
