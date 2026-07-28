# Нотариус в Караганде — лендинг

Одностраничный сайт частного нотариуса Тусупова Темиргали Расовича
(г. Караганда, проспект Бухар жырау, строение 49).
React 18 + Create React App, Bootstrap 5 подключён только как CSS.

## Структура страницы

`src/index.js` собирает страницу целиком:
Header → App → Footer → MobileCallBar (плавающая панель связи, только мобилка).

Внутри `App.js`: Hero → TrustSection → Услуги → FAQ → Расположение → ContactForm.

## Контактные данные

Адрес, телефон, e-mail, график работы и данные лицензии живут **только**
в `src/config/contacts.js`. Менять их нужно там: компоненты и тесты читают
конфиг, а дублирование строкой ловится тестом (`src/accessibility.test.js`).

SEO-обвязка (`public/index.html`: title, description, keywords, OG, JSON-LD)
правится вручную и сверяется с конфигом в `src/seo.test.js` — меняя график
или адрес, обновите разметку JSON-LD.

## Динамические данные

Два блока считаются на клиенте от системных часов посетителя:

- **Статус приёма** в hero («Открыто сейчас» / «Обед до 14:00» / «Закрыто»).
  `getWorkStatus()` берёт `opensAt`/`closesAt`/`lunchFrom`/`lunchTo`/`dayOffIndex`
  из `contacts.schedule`. Часовой пояс не нормализуется — посетитель из другого
  пояса увидит статус по своим часам. Значение пересчитывается раз в минуту.
- **Стаж** в блоке доверия. Считается от даты лицензии (28.12.2010), год
  засчитывается только после годовщины — до 28 декабря стаж на год меньше.

## Известные ограничения

- **Токен Telegram-бота в бандле.** Форма отправляет заявку напрямую в Telegram
  Bot API из браузера; токен бота и `chat_id` лежат в `src/ContactForm.jsx`
  и попадают в публичный бандл. Перед боевым запуском вынести отправку
  на бэкенд/прокси и перевыпустить токен.
- **Ссылка на Telegram отключена** (`contacts.phone.telegram === null`):
  `t.me/<номер телефона>` — битый адрес, нужен @username от заказчика.
- **`og:image` задан относительным путём.** Для превью в соцсетях нужен
  абсолютный URL — подставить после того, как будет известен домен.

## Зависимости и требования

Шрифты Playfair Display и Inter грузятся с `fonts.googleapis.com`
(`public/index.html`). Если CDN недоступен, вёрстка откатится на
Georgia / системный sans-serif — это учтено в `--font-heading` / `--font-body`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
