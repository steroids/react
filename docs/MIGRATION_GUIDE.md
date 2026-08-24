# Migration Guide

## steroids/dev#669 — замена `connected-react-router` на `@lagunovsky/redux-react-router`, react-router v5 → v7

`connected-react-router` больше не поддерживается и несовместим с react-router v6/v7, поэтому
он заменён на `@lagunovsky/redux-react-router`, а `react-router`/`react-router-dom` подняты с
v5.3.4 до v7.18.2. Публичный API самого `@steroidsjs/core` (компонент `<Router>`, селекторы
`state.router.*` из `reducers/router.ts`, `goToRoute`/`goToParent`, `useAddressBar`) не
изменился — эти пункты касаются только проектов, которые **сами напрямую** используют
`connected-react-router`, `react-router`/`react-router-dom` или `history` в обход steroids.
Если ваш проект работает с роутингом только через компоненты и хуки `@steroidsjs/core`,
никаких действий не требуется.

### 1. Пакеты

- Удалить прямую зависимость на `connected-react-router` из `package.json` проекта, если она
  есть — пакета в дереве зависимостей `@steroidsjs/core` больше нет.
- Обновить `react-router` до `^7.18.2`, удалить `react-router-dom`
- Если проект напрямую использует API `connected-react-router` (например, диспатчит
  `push`/`replace` из него, рендерит `<ConnectedRouter>`), добавить
  `@lagunovsky/redux-react-router@^4.5.0`.

### 2. Импорты из `react-router-dom`

Все импорты вида `import {...} from 'react-router-dom'` нужно заменить на
`import {...} from 'react-router'` — отдельного пакета `react-router-dom` в v7 больше нет.
`StaticRouter` (если используется для SSR напрямую) импортируется из `'react-router'`, а не из
`'react-router-dom/server'`.

### 3. `<Switch>`, `<Route render>`, `<Redirect>`

Если в проекте есть собственные роуты, написанные напрямую через react-router (а не только
через `routesMap`/`<Router>` из `@steroidsjs/core`):

- `<Switch>` в v7 не существует — использовать вложенные `<Routes>`/`<Route>` с
  ранжированным сопоставлением v6+.
- проп `render` у `<Route>` убран — использовать `element`/`Component` либо читать пропсы
  роута через хуки (`useParams`, `useLocation`, `useMatch`) внутри компонента страницы.
- `<Redirect to=... />` заменяется на `<Navigate to=... replace />`. Важно: `<Navigate>`
  выполняет переход через `useEffect`, который **не отрабатывает** во время `renderToString()`
  при SSR — если редирект должен повлиять на HTTP-ответ, его нужно обрабатывать отдельно (как
  это сделано внутри `<Router>` из `@steroidsjs/core`, см. п. 6).

### 4. `matchPath` из `react-router`

Если проект вызывает `matchPath` напрямую из пакета `react-router` (не из
`@steroidsjs/core/reducers/router`, где сохранена v5-совместимая сигнатура), сигнатура
поменялась:

```diff
- matchPath(pathname, {path, exact, strict})
+ matchPath({path, end, caseSensitive}, pathname)
```

`exact` → `end`. У `strict` нет прямого аналога в v6/v7.

### 5. Действия и константы `connected-react-router`

- `push`/`replace`, импортированные из `connected-react-router`, нужно заменить на аналоги из
  `@lagunovsky/redux-react-router`. Обратите внимание: `push`/`replace` из `@lagunovsky` по
  умолчанию асинхронные (`asEffect: true`, история меняется в middleware уже после диспатча) —
  для прежнего синхронного поведения использовать `pushStraight`/`replaceStraight`.
- `<ConnectedRouter history={...}>` заменяется на `<ReduxRouter history={...}>` из
  `@lagunovsky/redux-react-router`.
- Если где-то в проекте есть код, сравнивающий тип экшена со строкой
  `'@@router/LOCATION_CHANGE'` (например, кастомный middleware или редьюсер), заменить на
  константу `ROUTER_ON_LOCATION_CHANGED` из `@lagunovsky/redux-react-router` — строковое
  значение экшена изменилось.

### 6. SSR: `staticContext`

Если проект напрямую типизирует объект, который передаётся в `<SsrProvider staticContext={...}>`
из `@steroidsjs/core`, ранее для этого использовался тип `StaticRouterContext` из
`react-router` — в v6/v7 он не существует. Нужно использовать тип `IStaticContext`,
экспортируемый из `@steroidsjs/core/providers/SsrProvider`. Логика (мутация объекта, который
после `renderToString()` читается для определения статус-кода/редиректа) не изменилась — это
чисто изменение типа.

### 7. `history` v4 → v5

`history`, используемый под капотом (`components.store.history`), теперь v5, а не v4. Если
проект напрямую взаимодействует с этим объектом:

- `location` теперь **read-only** — прямая мутация (`history.location.search = '...'`) больше
  не работает; нужно использовать `history.replace({...})`/`history.push({...})` с копией
  location.
- колбэк `history.listen(...)` теперь принимает один объект `{action, location}` вместо
  `(location, action)` — если в проекте есть собственные подписки на `history.listen`, их
  сигнатуру нужно обновить.
