import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Header from './Header';
import Footer from './Footer';
import { contacts, getWorkStatus } from './config/contacts';

const OLD_CITY = /тараз/i;
const OLD_STREET = /толе\s*би/i;

test('hero выводит ФИО, город и номер лицензии из конфига', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { level: 1, name: contacts.notary.fullName })
  ).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(`Нотариальные услуги в ${contacts.address.city}`))
  ).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(`Лицензия №${contacts.notary.licenseNumber}`))
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
  expect(screen.getByText(getWorkStatus().label)).toBeInTheDocument();
  contacts.schedule.lines.forEach((line) => {
    expect(screen.getByText(line)).toBeInTheDocument();
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
