import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import Header from './Header';
import Footer from './Footer';
import { contacts, getWorkStatus } from './config/contacts';

const OLD_CITY = /тараз/i;
const OLD_STREET = /толе\s*би/i;

test('hero выводит ФИО, город и номер лицензии из конфига', () => {
  render(<App />);
  const hero = screen.getByRole('region', { name: contacts.notary.fullName });
  expect(
    screen.getByRole('heading', { level: 1, name: contacts.notary.fullName })
  ).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(`Нотариальные услуги в ${contacts.address.city}`))
  ).toBeInTheDocument();
  // Номер лицензии есть и в hero, и в блоке доверия — проверяем именно hero.
  expect(
    within(hero).getByText(new RegExp(`Лицензия №${contacts.notary.licenseNumber}`))
  ).toBeInTheDocument();
});

test('hero содержит CTA: позвонить, WhatsApp и запись со скроллом к форме', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: /Позвонить/ })).toHaveAttribute(
    'href',
    contacts.phone.tel
  );
  expect(screen.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute(
    'href',
    contacts.phone.whatsappWithText
  );

  const bookLink = screen.getByRole('link', { name: /Записаться/ });
  expect(bookLink).toHaveAttribute('href', '#contact-form');

  // Клик скроллит к секции формы, а не прыгает по якорю.
  // Якорь #contact-form должен существовать — иначе scrollIntoView не вызовется.
  const scrollIntoView = jest.fn();
  const original = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = scrollIntoView;
  fireEvent.click(bookLink);
  Element.prototype.scrollIntoView = original;
  expect(scrollIntoView).toHaveBeenCalled();
});

test('hero показывает бейдж статуса и часы работы, включая обед и выходной', () => {
  render(<App />);
  const hero = screen.getByRole('region', { name: contacts.notary.fullName });
  expect(screen.getByText(getWorkStatus().label)).toBeInTheDocument();
  // График дублируется у карты — ищем именно в hero.
  contacts.schedule.lines.forEach((line) => {
    expect(within(hero).getByText(line)).toBeInTheDocument();
  });
});

test('статус приёма вычисляется по графику', () => {
  // Понедельник 10:00 — рабочее время.
  expect(getWorkStatus(new Date(2026, 6, 27, 10, 0)).state).toBe('open');
  // Понедельник 13:30 — обед.
  const lunch = getWorkStatus(new Date(2026, 6, 27, 13, 30));
  expect(lunch.state).toBe('lunch');
  expect(lunch.label).toMatch(/14:00/);
  // Понедельник 8:00 и 19:00 — до открытия и после закрытия.
  expect(getWorkStatus(new Date(2026, 6, 27, 8, 0)).state).toBe('closed');
  expect(getWorkStatus(new Date(2026, 6, 27, 19, 0)).state).toBe('closed');
  // Суббота 12:00 — рабочий день.
  expect(getWorkStatus(new Date(2026, 6, 25, 12, 0)).state).toBe('open');
  // Воскресенье 12:00 — выходной, несмотря на «рабочий» час.
  const sunday = getWorkStatus(new Date(2026, 6, 26, 12, 0));
  expect(sunday.state).toBe('closed');
  expect(sunday.label).toMatch(/выходной/);
});

test('hero не использует градиент и SVG-паттерн из старого шаблона', () => {
  const css = require('fs').readFileSync(
    require('path').join(__dirname, 'App.css'),
    'utf8'
  );
  expect(css).not.toContain('.about-lawyer');
  const hero = css.match(/\.hero\s*\{([\s\S]*?)\}/)[1];
  expect(hero).not.toMatch(/gradient|data:image\/svg/);
  expect(hero).toContain('var(--primary-color)');
});

test('карта указывает на новый адрес и не содержит координат Тараза', () => {
  render(<App />);
  const map = screen.getByTitle(new RegExp(contacts.address.full));
  expect(map.getAttribute('src')).toContain(encodeURIComponent(contacts.address.full));
  expect(map.getAttribute('src')).not.toMatch(/71\.379|42\.901/);
});

test('карта тянется контейнером с aspect-ratio, без фиксированных width/height', () => {
  render(<App />);
  const map = screen.getByTitle(new RegExp(contacts.address.full));
  expect(map).not.toHaveAttribute('width');
  expect(map).not.toHaveAttribute('height');

  const css = require('fs').readFileSync(
    require('path').join(__dirname, 'App.css'),
    'utf8'
  );
  const frame = css.match(/\.location-map-frame\s*\{([\s\S]*?)\}/)[1];
  expect(frame).toMatch(/aspect-ratio/);
});

test('фото здания описано адресом, ленивое и с размерами против CLS', () => {
  render(<App />);
  const photo = screen.getByRole('img', {
    name: new RegExp(contacts.address.full),
  });
  expect(photo).toHaveAttribute('loading', 'lazy');
  expect(photo).toHaveAttribute('width', '960');
  expect(photo).toHaveAttribute('height', '1280');
  expect(photo.getAttribute('alt')).not.toBe('Location');
});

test('рядом с картой продублированы адрес и график текстом', () => {
  render(<App />);
  const details = screen.getByRole('group', { name: /Адрес и часы работы/ });
  expect(details).toHaveTextContent(contacts.address.full);
  contacts.schedule.lines.forEach((line) => {
    expect(within(details).getByText(line)).toBeInTheDocument();
  });
});

test('под картой есть ссылка «Построить маршрут» на новый адрес', () => {
  render(<App />);
  const route = screen.getByRole('link', { name: /Построить маршрут/ });
  expect(route).toHaveAttribute('href', contacts.address.directionsUrl);
  expect(route.getAttribute('href')).toContain(
    encodeURIComponent(contacts.address.full)
  );
  expect(route).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

test('фото и карта выровнены сеткой, а не flex-wrap с разными размерами', () => {
  const css = require('fs').readFileSync(
    require('path').join(__dirname, 'App.css'),
    'utf8'
  );
  const content = css.match(/\.location-content\s*\{([\s\S]*?)\}/)[1];
  expect(content).toMatch(/display:\s*grid/);
  expect(content).not.toMatch(/flex-wrap/);
  // На широком экране — две равные колонки, растянутые по высоте.
  expect(css).toMatch(/@media \(min-width: 992px\)[\s\S]*?grid-template-columns:\s*1fr 1fr/);
});

test('карточки услуг одной высоты и без вращения иконки на hover', () => {
  const css = require('fs').readFileSync(
    require('path').join(__dirname, 'App.css'),
    'utf8'
  );
  const body = css.match(/\.service-card \.card-body\s*\{([\s\S]*?)\}/)[1];
  expect(body).toMatch(/display:\s*flex/);
  expect(body).toMatch(/flex-direction:\s*column/);
  expect(css).toMatch(/\.service-card \.card-text\s*\{[\s\S]*?flex-grow:\s*1/);
  // Иконка на hover меняет только цвет.
  const iconHover = css.match(/\.service-card:hover \.fa-2x\s*\{([\s\S]*?)\}/)[1];
  expect(iconHover).not.toMatch(/rotate|transform/);
});

test('шапка показывает Караганду и телефон из конфига', () => {
  const { container } = render(<Header />);
  expect(screen.getByText(contacts.address.cityPrefixed)).toBeInTheDocument();
  expect(screen.getByText(contacts.address.lineShort)).toBeInTheDocument();
  expect(screen.getByText(contacts.phone.display)).toHaveAttribute('href', contacts.phone.tel);
  expect(container.textContent).not.toMatch(OLD_CITY);
  expect(container.textContent).not.toMatch(OLD_STREET);
});

test('подвал показывает новый адрес, график с обедом и выходным', () => {
  const { container } = render(<Footer />);
  expect(screen.getByText(contacts.address.cityPrefixed)).toBeInTheDocument();
  expect(screen.getByText(contacts.address.lineShort)).toBeInTheDocument();
  contacts.schedule.lines.forEach((line) => {
    expect(screen.getByText(line)).toBeInTheDocument();
  });
  expect(container.textContent).not.toMatch(OLD_CITY);
  expect(container.textContent).not.toMatch(OLD_STREET);
});

test('подвал использует e-mail из конфига, без домена taraz.kz', () => {
  render(<Footer />);
  const email = screen.getByText(contacts.email);
  expect(email).toHaveAttribute('href', `mailto:${contacts.email}`);
  expect(contacts.email).not.toMatch(/taraz/i);
});

test('конфиг собирает адрес и ссылки на телефон корректно', () => {
  expect(contacts.address.full).toBe('г. Караганда, проспект Бухар жырау, строение 49');
  expect(contacts.address.lineShort).toBe('пр. Бухар жырау, стр. 49');
  expect(contacts.phone.tel).toBe('tel:+77057372926');
  expect(contacts.phone.whatsapp).toContain('+77057372926');
  expect(contacts.phone.telegram).toContain('+77057372926');
});

test('график покрывает Пн-Сб 9-18 с обедом 13-14 и выходным в воскресенье', () => {
  const { schedule } = contacts;
  expect(schedule.opensAt).toBe(9);
  expect(schedule.closesAt).toBe(18);
  expect(schedule.lunchFrom).toBe(13);
  expect(schedule.lunchTo).toBe(14);
  expect(schedule.dayOffIndex).toBe(0);
});
