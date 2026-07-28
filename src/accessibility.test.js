import fs from 'fs';
import path from 'path';
import { render, screen, within } from '@testing-library/react';
import App from './App';
import Header from './Header';
import Footer from './Footer';
import { contacts } from './config/contacts';

function readCss(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

const indexCss = readCss('index.css');

// Токены из :root — по ним считаем контраст, чтобы проверка шла по реальным
// значениям, а не по продублированным в тесте константам.
const rootBlock = indexCss.match(/:root\s*\{([\s\S]*?)\n\}/)[1];
const tokens = Object.fromEntries(
  [...rootBlock.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ])
);

// Разворачивает var(--x) до литерального цвета.
function resolve(value) {
  let current = value;
  for (let i = 0; i < 5 && /^var\(/.test(current); i += 1) {
    current = tokens[current.match(/var\((--[\w-]+)\)/)[1]].trim();
  }
  return current;
}

function relativeLuminance(hex) {
  const channels = hex
    .replace('#', '')
    .match(/../g)
    .map((pair) => parseInt(pair, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const a = relativeLuminance(resolve(foreground));
  const b = relativeLuminance(resolve(background));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('контраст текстовых пар по WCAG AA', () => {
  // [подпись, цвет текста, фон] — все пары обычного (не крупного) текста,
  // поэтому порог 4.5:1.
  const pairs = [
    ['основной текст на кремовом фоне', 'var(--text-body)', 'var(--bg-cream)'],
    ['основной текст на белом', 'var(--text-body)', 'var(--bg-white)'],
    ['приглушённый текст на кремовом', 'var(--text-light)', 'var(--bg-cream)'],
    ['приглушённый текст на белом', 'var(--text-light)', 'var(--bg-white)'],
    ['заголовок на кремовом', 'var(--text-dark)', 'var(--bg-cream)'],
    ['текст на тёмно-синем', 'var(--text-on-dark)', 'var(--primary-color)'],
    ['светлое золото на тёмно-синем', 'var(--gold-light)', 'var(--primary-color)'],
    ['светлое золото на тёмном подвале', 'var(--gold-light)', 'var(--primary-dark)'],
    ['тёмное золото на кремовом', 'var(--gold-dark)', 'var(--bg-cream)'],
    ['тёмное золото на белом', 'var(--gold-dark)', 'var(--bg-white)'],
    ['тёмно-синий на белом', 'var(--primary-color)', 'var(--bg-white)'],
    ['текст на золотой кнопке', 'var(--primary-dark)', 'var(--gold)'],
    ['белый на WhatsApp', '#ffffff', 'var(--whatsapp)'],
    ['белый на WhatsApp hover', '#ffffff', 'var(--whatsapp-hover)'],
    ['белый на Telegram', '#ffffff', 'var(--telegram)'],
    ['белый на Telegram hover', '#ffffff', 'var(--telegram-hover)'],
    ['текст подвала на тёмном', '#cbd5e1', 'var(--primary-dark)'],
    ['ссылка подвала на тёмном', '#e2e8f0', 'var(--primary-dark)'],
  ];

  test.each(pairs)('%s ≥ 4.5:1', (_label, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  test('обводка фокуса контрастна к фону, на котором рисуется', () => {
    // Золотая обводка — на светлом, светло-золотая — на тёмно-синем.
    // Порог для нетекстовых элементов по WCAG 1.4.11 — 3:1.
    expect(
      contrastRatio(tokens['--focus-ring-color'], 'var(--bg-cream)')
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrastRatio(tokens['--focus-ring-color-on-dark'], 'var(--primary-color)')
    ).toBeGreaterThanOrEqual(3);
  });

  test('фирменные цвета мессенджеров затемнены и не остались исходными', () => {
    // #25d366 и #0088cc с белым текстом дают 1.5:1 и 3.9:1 — ниже AA.
    const allCss = ['App.css', 'Header.css', 'Footer.css', 'MobileCallBar.css']
      .map(readCss)
      .join('\n');
    expect(allCss.toLowerCase()).not.toContain('#25d366');
    expect(allCss.toLowerCase()).not.toContain('#0088cc');
    expect(allCss.toLowerCase()).not.toContain('#128c7e');
  });
});

describe('видимый фокус для интерактивных элементов', () => {
  test('index.css задаёт общий :focus-visible для ссылок, кнопок и полей', () => {
    const rule = indexCss.match(
      /((?:[a-z[\]\-\w]+:focus-visible,?\s*)+)\{([\s\S]*?)\}/
    );
    expect(rule).not.toBeNull();

    const selectors = rule[1];
    ['a:focus-visible', 'button:focus-visible', 'input:focus-visible', 'textarea:focus-visible'].forEach(
      (selector) => {
        expect(selectors).toContain(selector);
      }
    );

    // Обводка именно видимая: outline: none здесь был бы регрессом.
    expect(rule[2]).toMatch(/outline:\s*var\(--focus-ring-width\)\s+solid/);
    expect(rule[2]).toMatch(/outline-offset:/);
  });

  test('на тёмных секциях обводка переключается на светлое золото', () => {
    expect(indexCss).toMatch(
      /\.hero a:focus-visible[\s\S]*?\{[^}]*outline-color:\s*var\(--focus-ring-color-on-dark\)/
    );
  });

  test('ни один компонент не убирает обводку насовсем', () => {
    // outline: none допустим только если рядом задан свой видимый индикатор
    // (как у поля формы — там подсвечивается рамка и box-shadow).
    const componentCss = [
      'App.css',
      'Header.css',
      'Footer.css',
      'Faq.css',
      'TrustSection.css',
      'ContactForm.css',
      'MobileCallBar.css',
    ];

    const offenders = componentCss.flatMap((file) => {
      const css = readCss(file);
      return [...css.matchAll(/([^{}]+):focus-visible[^{]*\{([^}]*)\}/g)]
        .filter(
          ([, , body]) =>
            /outline:\s*none/.test(body) &&
            !/box-shadow:|border-color:|background:/.test(body)
        )
        .map(([, selector]) => `${file}: ${selector.trim()}`);
    });

    expect(offenders).toEqual([]);
  });
});

describe('секции размечены как <section> с доступным именем', () => {
  test('услуги, расположение и форма — это регионы с заголовками', () => {
    render(<App />);

    [
      ['Нотариальные услуги', 'services-title'],
      ['Расположение', 'location-title'],
      ['Свяжитесь с нами', 'contact-form-title'],
    ].forEach(([name, id]) => {
      const region = screen.getByRole('region', { name });
      expect(region.tagName).toBe('SECTION');
      expect(region).toHaveAttribute('aria-labelledby', id);
      // aria-labelledby должен указывать на существующий заголовок,
      // иначе имя региона пустое.
      expect(within(region).getByRole('heading', { name })).toHaveAttribute('id', id);
    });
  });

  test('в App.js не осталось <div> вместо секций верхнего уровня', () => {
    const source = fs.readFileSync(path.join(__dirname, 'App.js'), 'utf8');
    expect(source).not.toMatch(/<div className="container services-section"/);
    expect(source).not.toMatch(/<div className="container-fluid location-section"/);
  });

  test('на странице один <h1> — ФИО нотариуса в hero', () => {
    render(<App />);
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(contacts.notary.fullName);
  });
});

describe('prefers-reduced-motion отключает движение', () => {
  const block = indexCss.match(
    /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/
  );

  test('блок объявлен в index.css', () => {
    expect(block).not.toBeNull();
  });

  test('анимации и переходы сводятся к мгновенным', () => {
    expect(block[1]).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(block[1]).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
  });

  test('подъёмы карточек и поворот шеврона отключены, а не ускорены', () => {
    expect(block[1]).toMatch(/\.service-card:hover[\s\S]*?transform:\s*none/);
    expect(block[1]).toMatch(/faq-indicator\s*\{[^}]*transform:\s*none/);
  });

  test('плавный скролл выключается — он тоже движение', () => {
    expect(block[1]).toMatch(/scroll-behavior:\s*auto/);
  });
});

describe('контактные данные берутся только из config/contacts.js', () => {
  const sourceFiles = fs
    .readdirSync(__dirname)
    .filter((file) => /\.(js|jsx)$/.test(file) && !/\.test\.js$/.test(file))
    .filter((file) => file !== 'reportWebVitals.js' && file !== 'setupTests.js');

  test.each(sourceFiles)('%s не содержит захардкоженных телефона и адреса', (file) => {
    const source = fs.readFileSync(path.join(__dirname, file), 'utf8');

    expect(source).not.toMatch(/\+7\s*\(?705\)?[\s-]*737/);
    expect(source).not.toMatch(/77057372926/);
    expect(source).not.toMatch(/Бухар\s+жырау/);
    // Часы работы — тоже данные графика, их место в конфиге.
    expect(source).not.toMatch(/\b9:00\s*-\s*18:00\b/);
    expect(source).not.toMatch(/\b13:00\s*-\s*14:00\b/);
  });

  test('компоненты, показывающие контакты, импортируют конфиг', () => {
    ['Header.jsx', 'Footer.jsx', 'App.js', 'MobileCallBar.jsx', 'Faq.jsx'].forEach(
      (file) => {
        const source = fs.readFileSync(path.join(__dirname, file), 'utf8');
        expect(source).toMatch(/from ['"]\.\/config\/contacts['"]|from ['"]\.\/config\/contacts['"]/);
      }
    );
  });
});

test('старые данные по Таразу нигде не остались', () => {
  const OLD_DATA = /тараз|taraz|толе\s*би|жамбыл/i;

  render(<App />);
  expect(document.body.textContent).not.toMatch(OLD_DATA);

  const { container: header } = render(<Header />);
  expect(header.textContent).not.toMatch(OLD_DATA);

  const { container: footer } = render(<Footer />);
  expect(footer.textContent).not.toMatch(OLD_DATA);
});
