import fs from 'fs';
import path from 'path';
import { contacts } from './config/contacts';

const html = fs.readFileSync(
  path.join(__dirname, '..', 'public', 'index.html'),
  'utf8'
);

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'public', 'manifest.json'), 'utf8')
);

const OLD_DATA = /тараз|taraz|толе\s*би|жамбыл/i;
// Город встречается в разных падежах («Караганда», «в Караганде»).
const CITY = /Караганд[аеуы]/;

// Достаём содержимое единственного <script type="application/ld+json">.
const jsonLd = JSON.parse(
  html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  )[1].replace(/%PUBLIC_URL%/g, '')
);

test('в index.html не осталось упоминаний старого города и области', () => {
  expect(html).not.toMatch(OLD_DATA);
});

test('язык страницы — русский', () => {
  expect(html).toMatch(/<html lang="ru">/);
});

test('title содержит город и ФИО нотариуса', () => {
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  expect(title).toMatch(CITY);
  expect(title).toContain(contacts.notary.fullName);
});

test('keywords построены под карагандинские запросы', () => {
  const keywords = html.match(/<meta name="keywords" content="(.*?)">/)[1];
  expect(keywords.toLowerCase()).toContain('нотариус караганда');
  expect(keywords).not.toMatch(OLD_DATA);
});

test('description один и содержит адрес, телефон и график с обедом', () => {
  const descriptions = html.match(/<meta\s+name="description"/g);
  expect(descriptions).toHaveLength(1);

  const description = html.match(
    /<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/>/
  )[1];
  expect(description).not.toMatch(/create-react-app/i);
  expect(description).toContain(contacts.address.city);
  expect(description).toContain(contacts.address.street);
  expect(description).toContain(contacts.phone.display);
  expect(description).toContain('обед 13:00-14:00');
  expect(description).toContain('воскресенье выходной');
});

test('указана Карагандинская областная нотариальная палата', () => {
  expect(html).toContain('Карагандинская областная нотариальная палата');
});

test('Open Graph теги заполнены и локаль русская', () => {
  expect(html).toMatch(/<meta property="og:title" content="[^"]*Караганде[^"]*"/);
  expect(html).toMatch(/<meta property="og:description" content="[^"]+"/);
  expect(html).toMatch(/<meta property="og:image" content="[^"]+"/);
  expect(html).toContain('<meta property="og:locale" content="ru_RU" />');
});

test('JSON-LD описывает нотариуса с новым адресом и телефоном', () => {
  expect(jsonLd['@type']).toBe('LegalService');
  expect(jsonLd.additionalType).toBe('https://schema.org/Notary');
  expect(jsonLd.telephone).toBe(contacts.phone.raw);
  expect(jsonLd.email).toBe(contacts.email);
  expect(jsonLd.address.addressLocality).toBe(contacts.address.city);
  expect(jsonLd.address.streetAddress).toBe(
    `${contacts.address.street}, ${contacts.address.building}`
  );
  expect(jsonLd.founder.hasCredential.identifier).toBe(
    contacts.notary.licenseNumber
  );
});

test('openingHoursSpecification разбит обедом на две смены Пн-Сб', () => {
  const [morning, evening] = jsonLd.openingHoursSpecification;
  const workDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  expect(jsonLd.openingHoursSpecification).toHaveLength(2);
  expect(morning.dayOfWeek).toEqual(workDays);
  expect(evening.dayOfWeek).toEqual(workDays);
  expect(morning.opens).toBe('09:00');
  expect(morning.closes).toBe('13:00');
  expect(evening.opens).toBe('14:00');
  expect(evening.closes).toBe('18:00');
  // Воскресенье не упомянуто — выходной.
  expect(JSON.stringify(jsonLd.openingHoursSpecification)).not.toContain(
    'Sunday'
  );
});

test('имя пакета и manifest не привязаны к старому городу', () => {
  expect(pkg.name).toBe('karaganda_notarius');
  expect(pkg.name).not.toMatch(OLD_DATA);
  expect(manifest.name).toMatch(CITY);
  expect(manifest.short_name).not.toMatch(/React App/);
});

test('README не содержит упоминаний старого города', () => {
  const readme = fs.readFileSync(
    path.join(__dirname, '..', 'README.md'),
    'utf8'
  );
  expect(readme).not.toMatch(OLD_DATA);
});
