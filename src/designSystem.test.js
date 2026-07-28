import fs from 'fs';
import path from 'path';

const css = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8');
const html = fs.readFileSync(
  path.join(__dirname, '..', 'public', 'index.html'),
  'utf8'
);

// Достаём блок :root {...} и разбираем его в карту токенов.
const root = css.match(/:root\s*\{([\s\S]*?)\n\}/)[1];
const tokens = Object.fromEntries(
  [...root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ])
);

test('значения токенов не содержат случайных не-ASCII символов', () => {
  // Комментарии на русском допустимы, а вот в значении цвета кириллица —
  // опечатка, которая ломает CSS молча.
  Object.entries(tokens).forEach(([name, value]) => {
    const nonAscii = [...`${name}: ${value}`].filter(
      (char) => char.codePointAt(0) > 127
    );
    expect(nonAscii).toEqual([]);
  });
});

test('primary-палитра переведена на тёмно-синий, без SaaS-синего', () => {
  expect(tokens['--primary-color'].toLowerCase()).toBe('#132a4a');
  ['--primary-color', '--primary-light', '--primary-dark'].forEach((name) => {
    expect(tokens[name]).toMatch(/^#[0-9a-f]{6}$/i);
  });
  // Старые ярко-синие значения не должны остаться.
  expect(css.toLowerCase()).not.toContain('#1e3a8a');
  expect(css.toLowerCase()).not.toContain('#3b82f6');
});

test('добавлены золотые и тёплые нейтральные токены', () => {
  ['--gold', '--gold-dark', '--gold-light', '--bg-cream', '--border-subtle'].forEach(
    (name) => {
      expect(tokens[name]).toBeDefined();
    }
  );
  expect(tokens['--gold']).toMatch(/^#[0-9a-f]{6}$/i);
  expect(tokens['--bg-cream']).toMatch(/^#[0-9a-f]{6}$/i);
});

test('есть шкала отступов --space-1..--space-8 с возрастающими значениями', () => {
  const scale = [];
  for (let i = 1; i <= 8; i += 1) {
    const value = tokens[`--space-${i}`];
    expect(value).toMatch(/^\d+px$/);
    scale.push(parseInt(value, 10));
  }
  scale.slice(1).forEach((value, index) => {
    expect(value).toBeGreaterThan(scale[index]);
  });
});

test('есть шкала радиусов, а --border-radius сведён к ней', () => {
  ['--radius-sm', '--radius-md', '--radius-lg'].forEach((name) => {
    expect(tokens[name]).toMatch(/^\d+px$/);
  });
  expect(parseInt(tokens['--radius-lg'], 10)).toBeGreaterThan(
    parseInt(tokens['--radius-sm'], 10)
  );
  expect(tokens['--border-radius']).toBe('var(--radius-md)');
});

test('тени спокойные: три уровня, blur не больше 16px', () => {
  ['--shadow-sm', '--shadow-md', '--shadow-lg'].forEach((name) => {
    // Формат: <x> <y> <blur> <color>
    const blur = parseInt(tokens[name].split(/\s+/)[2], 10);
    expect(blur).toBeLessThanOrEqual(16);
  });
  // Прежний --shadow-xl с blur 25px удалён вместе с остальными мёртвыми токенами.
  expect(tokens['--shadow-xl']).toBeUndefined();
});

test('в палитре нет токенов, которых никто не использует', () => {
  // Мёртвый токен создаёт вид «ещё одного акцента» и провоцирует
  // добавить непроверенную на контраст пару цветов.
  const declared = Object.keys(tokens);
  const componentCss = ['App.css', 'Header.css', 'Footer.css', 'Faq.css',
    'TrustSection.css', 'ContactForm.css', 'MobileCallBar.css']
    .map((file) => fs.readFileSync(path.join(__dirname, file), 'utf8'))
    .join('\n');
  const allCss = `${css}\n${componentCss}`;

  const unused = declared.filter(
    (name) => !new RegExp(`var\\(\\s*${name}\\b`).test(allCss)
  );
  expect(unused).toEqual([]);
});

test('заданы отдельные шрифты для заголовков и текста', () => {
  expect(tokens['--font-heading']).toMatch(/serif/i);
  expect(tokens['--font-body']).toMatch(/sans-serif/i);
});

test('serif-шрифт подключён в index.html', () => {
  expect(html).toMatch(/fonts\.googleapis\.com[^"]*Playfair\+Display/);
  expect(html).toContain('rel="preconnect"');
});

test('заголовки используют --font-heading с настроенным ритмом', () => {
  const headings = css.match(/h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{([\s\S]*?)\}/)[1];
  expect(headings).toContain('font-family: var(--font-heading)');
  expect(headings).toMatch(/letter-spacing:/);
  expect(headings).toMatch(/line-height:/);
});

test('переход сокращён до 0.2s, глобальный подъём кнопки убран', () => {
  expect(tokens['--transition']).toBe('all 0.2s ease');
  expect(css).not.toMatch(/\.btn:hover\s*\{[\s\S]*?translateY/);
});
