import { render, screen } from '@testing-library/react';
import App from './App';
import Header from './Header';
import Footer from './Footer';
import { contacts } from './config/contacts';

const OLD_CITY = /тараз/i;
const OLD_STREET = /толе\s*би/i;

test('hero выводит ФИО и номер лицензии из конфига', () => {
  render(<App />);
  expect(screen.getByText(contacts.notary.fullName.toUpperCase())).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(`Лицензии №${contacts.notary.licenseNumber}`))
  ).toBeInTheDocument();
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
