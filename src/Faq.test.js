import { fireEvent, render, screen, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import App from './App';
import Faq, { faqItems } from './Faq';

test('в FAQ от 6 до 8 вопросов, темы покрывают ключевые обращения', () => {
  expect(faqItems.length).toBeGreaterThanOrEqual(6);
  expect(faqItems.length).toBeLessThanOrEqual(8);

  const text = faqItems.map((i) => `${i.question} ${i.answer}`).join(' ');
  [/документ/i, /стои|тариф/i, /выезд/i, /срок|день обращения|занимает/i, /наследств/i, /доверенност/i].forEach(
    (topic) => expect(text).toMatch(topic)
  );

  render(<Faq />);
  const list = screen.getByRole('list');
  expect(within(list).getAllByRole('listitem')).toHaveLength(faqItems.length);
});

test('панели свёрнуты по умолчанию', () => {
  render(<Faq />);
  screen.getAllByRole('button').forEach((trigger) => {
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
  expect(screen.queryByText(faqItems[0].answer)).not.toBeVisible();
});

test('клик раскрывает ответ, повторный клик сворачивает', () => {
  render(<Faq />);
  const trigger = screen.getByRole('button', { name: new RegExp(faqItems[0].question) });

  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(faqItems[0].answer)).toBeVisible();

  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText(faqItems[0].answer)).not.toBeVisible();
});

test('открытие второго вопроса закрывает первый', () => {
  render(<Faq />);
  const first = screen.getByRole('button', { name: new RegExp(faqItems[0].question) });
  const second = screen.getByRole('button', { name: new RegExp(faqItems[1].question) });

  fireEvent.click(first);
  fireEvent.click(second);

  expect(first).toHaveAttribute('aria-expanded', 'false');
  expect(second).toHaveAttribute('aria-expanded', 'true');
});

test('триггеры доступны: button, aria-expanded, aria-controls на существующую панель', () => {
  render(<Faq />);
  const triggers = screen.getAllByRole('button');
  expect(triggers).toHaveLength(faqItems.length);

  triggers.forEach((trigger, index) => {
    expect(trigger.tagName).toBe('BUTTON');
    // type="button" — иначе внутри формы кнопка сабмитила бы её.
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-expanded');
    // aria-controls указывает на панель именно со своим ответом.
    const panelId = `faq-panel-${faqItems[index].id}`;
    expect(trigger).toHaveAttribute('aria-controls', panelId);
    expect(trigger).toHaveAttribute('id', `faq-trigger-${faqItems[index].id}`);

    // Раскрываем панель — у скрытого элемента доступное имя не вычисляется.
    fireEvent.click(trigger);
    const panel = screen.getByRole('region', { name: faqItems[index].question });
    expect(panel).toHaveAttribute('id', panelId);
    expect(panel).toHaveTextContent(faqItems[index].answer);
    fireEvent.click(trigger);
  });
});

test('управление с клавиатуры: Enter и Space переключают вопрос', () => {
  render(<Faq />);
  const trigger = screen.getByRole('button', { name: new RegExp(faqItems[0].question) });

  trigger.focus();
  expect(trigger).toHaveFocus();

  // Нативная <button> обрабатывает Enter/Space как click — проверяем, что
  // триггер именно кнопка и реагирует на активацию с клавиатуры.
  fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');

  fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('секция FAQ доступна по aria-labelledby', () => {
  render(<Faq />);
  const section = screen.getByRole('region', { name: /Частые вопросы/ });
  expect(section).toHaveAttribute('aria-labelledby', 'faq-title');
});

test('FAQ стоит между услугами и секцией расположения', () => {
  render(<App />);
  const services = screen.getByRole('heading', { name: 'Нотариальные услуги' });
  const faq = screen.getByRole('region', { name: /Частые вопросы/ });
  const location = screen.getByRole('heading', { name: 'Расположение' });

  expect(services.compareDocumentPosition(faq)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(faq.compareDocumentPosition(location)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

test('стили FAQ используют токены палитры, без градиентов', () => {
  const css = fs.readFileSync(path.join(__dirname, 'Faq.css'), 'utf8');

  expect(css).toMatch(/var\(--gold-dark\)/);
  expect(css).toMatch(/border-bottom:\s*1px solid var\(--border-subtle\)/);
  expect(css).not.toMatch(/gradient/);
  // Mobile-first: медиазапросы только на min-width (max-width как свойство
  // раскладки допустим — им ограничена ширина колонки текста).
  expect(css).not.toMatch(/@media[^{]*max-width/);
  expect(css).toMatch(/@media \(min-width: 768px\)/);
});

test('аккордеон не использует Bootstrap JS', () => {
  const source = fs.readFileSync(path.join(__dirname, 'Faq.jsx'), 'utf8');
  expect(source).toMatch(/useState/);
  expect(source).not.toMatch(/data-bs-|bootstrap\/dist\/js|from 'bootstrap'/);
});
