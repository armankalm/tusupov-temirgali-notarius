# CLAUDE.md

Лендинг нотариуса в Караганде. React 18 (Create React App), Bootstrap 5 только как CSS.

## Команды

- `npm start` — дев-сервер
- `npm test` — watch-режим
- Проверка перед коммитом:
  - `CI=true npx react-scripts test`
  - `CI=true npx react-scripts build` (предупреждения фатальны при CI=true)
  - `npx eslint src --ext .js,.jsx`

## Архитектура

Точка сборки страницы — `src/index.js`:
Header → App → Footer → MobileCallBar.
Внутри `App.js`: Hero → TrustSection → Услуги → Faq → Расположение → ContactForm.

Bootstrap подключён **только** как CSS — JS-плагины не используются.
FAQ-аккордеон написан на `useState`, тест запрещает атрибуты `data-bs-*`.

## Единый источник правды

`src/config/contacts.js` — адрес, телефон, e-mail, график, лицензия,
`PRACTICE_SINCE`. Плюс хелперы `getWorkStatus`, `getYearsOfPractice`,
`pluralizeYears`, `formatYearsOfPractice`.

Нельзя писать номер, улицу или часы работы строкой в компонентах —
это ловит `src/accessibility.test.js`. Строки графика (`schedule.lines`)
собираются геттером из полей, а не дублируются.

## Дизайн-система

Токены в `:root` (`src/index.css`): палитра, `--space-1..8`, `--radius-*`,
`--shadow-sm/md/lg`, `--font-heading`/`--font-body`, `--focus-ring-*`.
`--border-radius` — алиас `var(--radius-md)`, оставлен ради обратной
совместимости, тест требует его сохранения.

Мёртвых токенов быть не должно: `designSystem.test.js` падает, если
объявленный токен нигде не используется через `var()`.

Никаких градиентов, `rotate()` в hover и подъёмов больше 4px.

## Тесты читают CSS как текст

`designSystem.test.js`, `mobileFirst.test.js` и `accessibility.test.js`
парсят `.css` регулярками через `fs.readFileSync`. Переименование класса
или переформатирование правила ломает тест без изменения поведения.
Правя CSS, смотрите соответствующий тест.

Правила, зафиксированные тестами:

- только `min-width` в медиазапросах (одиночный `max-width` запрещён);
- тач-таргеты ≥ 44px;
- контраст ≥ 4.5:1 по вычисленным токенам, обводка фокуса ≥ 3:1;
- никаких `width`/`min-width` больше 320px вне медиазапросов;
- `outline: none` допустим только вместе со своим видимым индикатором
  (border-color / box-shadow / background).

## Имена классов не глобальны по смыслу, но глобальны по факту

CSS-файлы компонентов не изолированы (не CSS-модули). `Header.css` грузится
после `App.css`, поэтому одинаковые имена классов конфликтуют:
`.location-address` и `.location-details` есть и в шапке, и в секции
«Расположение». Правила шапки скоупятся под `.modern-header`.
Добавляя класс, проверьте `grep` по `src/*.css`.

## Заголовки

На странице ровно один `<h1>` — заголовок hero-секции. В шапке имя нотариуса
это `<p class="brand-name">`, а не заголовок. Тесты рендерят компоненты
по отдельности, поэтому дубль `<h1>` они не поймают — следите вручную.

## SEO

`public/index.html` — title/description/keywords/OG/Twitter/JSON-LD
(`LegalService` + `Notary`, `openingHoursSpecification` двумя сменами
из-за обеда). Меняя график в конфиге, обновите JSON-LD руками —
`src/seo.test.js` сверяет их между собой.

## Форма обратной связи

`ContactForm.jsx` шлёт заявку прямо в Telegram Bot API из браузера.
Токен и `chat_id` захардкожены и попадают в бандл — известное ограничение,
вынос на бэкенд ещё не сделан (см. README).

Отправка идёт с `parse_mode: 'HTML'`, поэтому пользовательский ввод
экранируется (`&`, `<`, `>`) — иначе Telegram отвечает 400 и заявка теряется.
Ошибки отправки показываются пользователю через `role="alert"`, а не
в консоль: молча терять заявку нельзя.
