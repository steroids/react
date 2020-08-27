# Роутинг

Стероиды позволяют задать единое дерево роутов всего проекта (нечто напоминающее карту сайта).

В проекте, как правило, дерево задается в файле `routes/index.ts`, где корневым роутом `root` является главная
страница (как правило, с адресом `/`), а вложенные ветви дерева задаются через `items`. Каждая страница описывается
объектом с интерфейсом `IRouteItem`.

Задав такое дерево, вы получаете сразу несколько преимуществ:

- Можно создавать ссылки по ID роута: `<Link toRoute='root'>...</Link>'`;
- Можно выбрать срез дерева и отрендерить по нему навигацию: `<Nav items='profile'/>`;
- Лейблы ссылок и заголовки страниц будут браться из описанного дерева роутов;
- Относительный путь до страниц (url) описывается только в дереве роутов, его легко изменять без рефакторинга проекта;
- Разработчик может наглядно увидеть всю карту проекта, просто открыв это файл.
- У роутов можно указывать роли (roles), для ограничения доступа к странице по ролям пользователей.

Пример дерера роутов из трех страниц - главной и страниц профиля:

```ts
import IndexPage from './IndexPage';
import ProfileGeneral from './ProfileGeneral';
import ProfileSettings from './ProfileSettings';
import {IRouteItem} from '@steroidsjs/core/ui/nav/Router/Router';

export const ROUTE_ROOT = 'root';
export const ROUTE_PROFILE = 'profile';
export const ROUTE_PROFILE_GENERAL = 'profile_general';
export const ROUTE_PROFILE_SETTINGS = 'profile_settings';

export default {
    id: ROUTE_ROOT,
    exact: true,
    path: '/',
    label: __('Главная страница'),
    component: IndexPage,
    roles: [null, 'user'], // Могут видеть гости и авторизованные пользователи
    items: {
        [ROUTE_PROFILE]: {
            label: __('Профиль'),
            path: '/profile',
            redirectTo: true,
            roles: [null, 'user'], // Могут видеть только авторизованные пользователи
            items: {
                [ROUTE_PROFILE_GENERAL]: {
                    label: __('Основная информация'),
                    path: '/profile/general',
                    component: ProfileGeneral,
                    // Тут роли не указываем, они наследуются от родителя
                },
                [ROUTE_PROFILE_SETTINGS]: {
                    label: __('Настройки'),
                    path: '/profile/settings',
                    component: ProfileSettings,
                },
            },
        },
    },
} as IRouteItem;
```

## Настройки роута

Параметры `path`, `exact` - передаются напрямую в React Router. Их описание можно посмотреть в официальной документации - https://reactrouter.com/web/api/Route/route-props.


## Название и лейбл

Для каждого роута можно указать `label` и `title`. Приложение само может распоряжаться по какой логике использовать
один или другой, но изначально смысл заложен такой - `label` используется для названия ссылок, а `title` - для заголовка
страниц (а если не задан - используется `label`).


## Редирект

Для автоматического редиректа роута на страницу, необходимо задать свойство `redirectTo`, в котором указывается `path`
до страницы.

Часто бывает, что необходимо сделать редирект на дочернюю страницу раздела. Например, чтобы `/profile` перенаправлял на
`/profile/general`, где `general` - одна из дочерних страниц профиля. В таком случае можно задать `redirectTo` в `true`,
чтобы редирект был сделан на первую дочернюю страницу.
