import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import MobileCallBar from './MobileCallBar';
import ContactForm from './ContactForm';
import { contacts } from './config/contacts';

function readCss(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

// Вырезает тело правила по селектору: `.foo {` ... `}`.
function ruleBody(css, selector) {
  const pattern = new RegExp(
    `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([\\s\\S]*?)\\}`
  );
  const match = css.match(pattern);
  expect(match).not.toBeNull();
  return match[1];
}

// Все @media-условия в файле — по ним проверяем направление вёрстки.
function mediaQueries(css) {
  return [...css.matchAll(/@media([^{]+)\{/g)].map(([, query]) => query.trim());
}

const MOBILE_FIRST_FILES = [
  'App.css',
  'Header.css',
  'Footer.css',
  'Faq.css',
  'TrustSection.css',
  'ContactForm.css',
  'MobileCallBar.css',
];

describe('медиазапросы переписаны на mobile-first', () => {
  test.each(MOBILE_FIRST_FILES)('%s использует только min-width', (file) => {
    const queries = mediaQueries(readCss(file));
    expect(queries.length).toBeGreaterThan(0);

    queries.forEach((query) => {
      expect(query).toMatch(/min-width/);
    });

    // max-width допустим только как верхняя граница диапазона, который уже
    // открыт через min-width (например, «только планшет»). Одиночный
    // max-width — это верстка от десктопа вниз.
    const desktopFirst = queries.filter(
      (query) => /max-width/.test(query) && !/min-width[\s\S]*max-width/.test(query)
    );
    expect(desktopFirst).toEqual([]);
  });

  test('index.css отдаёт мобильные значения по умолчанию', () => {
    const css = readCss('index.css');
    mediaQueries(css).forEach((query) => {
      expect(query).toMatch(/min-width/);
    });
  });
});

test('sticky-хедер остаётся липким на мобилке и не переключается на relative', () => {
  const css = readCss('Header.css');
  const header = ruleBody(css, '.modern-header');
  expect(header).toMatch(/position:\s*sticky/);
  expect(header).toMatch(/top:\s*0/);
  // Прежний max-width: 768px сбрасывал sticky в relative — этого быть не должно.
  expect(css).not.toMatch(/\.modern-header\s*\{[^}]*position:\s*relative/);
});

test('на мобилке хедер компактный: имя + кнопка звонка, контакты скрыты', () => {
  render(<Header />);

  const call = screen.getByRole('link', {
    name: new RegExp(`Позвонить ${contacts.phone.display.replace(/[()+]/g, '\\$&')}`),
  });
  expect(call).toHaveAttribute('href', contacts.phone.tel);
  expect(call).toHaveClass('header-call');

  const css = readCss('Header.css');
  // Базово (320px) развёрнутые контакты и адрес скрыты...
  expect(css).toMatch(
    /\.contact-info,\s*\.location-info\s*\{[^}]*display:\s*none/
  );
  // ...а от 768px — раскрываются, и кнопка звонка прячется.
  const tablet = css.match(/@media \(min-width: 768px\)\s*\{([\s\S]*?)\n\}/)[1];
  expect(tablet).toMatch(/\.contact-info,\s*\.location-info\s*\{[^}]*display:\s*flex/);
  expect(tablet).toMatch(/\.header-call\s*\{[^}]*display:\s*none/);
});

test('плавающая панель связи ведёт на телефон и WhatsApp из конфига', () => {
  render(<MobileCallBar />);

  const bar = screen.getByRole('navigation', { name: /Быстрая связь/ });
  expect(bar).toHaveClass('mobile-call-bar');

  expect(screen.getByRole('link', { name: /Позвонить/ })).toHaveAttribute(
    'href',
    contacts.phone.tel
  );
  const whatsapp = screen.getByRole('link', { name: /WhatsApp/ });
  expect(whatsapp).toHaveAttribute('href', contacts.phone.whatsappWithText);
  expect(whatsapp).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

test('плавающая панель зафиксирована внизу и скрыта на десктопе', () => {
  const css = readCss('MobileCallBar.css');
  const bar = ruleBody(css, '.mobile-call-bar');
  expect(bar).toMatch(/position:\s*fixed/);
  expect(bar).toMatch(/bottom:\s*0/);

  // На десктопе панель убирается — дублировать шапку не нужно.
  const desktop = css.match(/@media \(min-width: 992px\)\s*\{([\s\S]*?)\n\}/)[1];
  expect(desktop).toMatch(/\.mobile-call-bar\s*\{[^}]*display:\s*none/);

  // Под фиксированную панель у body зарезервировано место, иначе она
  // перекрывает конец подвала.
  const indexCss = readCss('index.css');
  expect(ruleBody(indexCss, 'body')).toMatch(/padding-bottom:/);
});

describe('тач-таргеты не меньше 44px', () => {
  const targets = [
    ['Header.css', '.social-link', ['width', 'height']],
    ['Header.css', '.header-call', ['width', 'height']],
    ['Header.css', '.icon-wrapper', ['width', 'height']],
    ['Footer.css', '.footer-social-link', ['width', 'height']],
    ['Footer.css', '.footer-link', ['min-height']],
    ['Faq.css', '.faq-trigger', ['min-height']],
    ['ContactForm.css', '.contact-form-control', ['min-height']],
    ['ContactForm.css', '.contact-form-submit', ['min-height']],
    ['MobileCallBar.css', '.mobile-call-btn', ['min-height']],
    ['App.css', '.hero-btn', ['min-height']],
    ['App.css', '.location-route', ['min-height']],
  ];

  test.each(targets)('%s %s', (file, selector, props) => {
    const body = ruleBody(readCss(file), selector);
    props.forEach((prop) => {
      const value = body.match(new RegExp(`${prop}:\\s*(\\d+)px`));
      expect(value).not.toBeNull();
      expect(Number(value[1])).toBeGreaterThanOrEqual(44);
    });
  });
});

test('на 320px ничего не выпирает: фиксированных ширин больше вьюпорта нет', () => {
  // Ловим width/min-width в пикселях, которые не поместятся в 320px минус паддинги.
  MOBILE_FIRST_FILES.concat('index.css').forEach((file) => {
    const css = readCss(file);
    [...css.matchAll(/(?:^|[\s;{])(min-)?width:\s*(\d+)px/g)].forEach(
      ([, , px]) => {
        expect(Number(px)).toBeLessThanOrEqual(320);
      }
    );
  });

  // Страховка от горизонтального скролла на узких экранах.
  expect(ruleBody(readCss('index.css'), 'body')).toMatch(/overflow-x:\s*hidden/);
});

test('поле телефона использует tel-клавиатуру на мобилке', () => {
  render(<ContactForm />);
  const phone = screen.getByLabelText('Телефон');
  expect(phone).toHaveAttribute('type', 'tel');
  expect(phone).toHaveAttribute('inputmode', 'tel');
  expect(phone).toHaveAttribute('autocomplete', 'tel');
});
