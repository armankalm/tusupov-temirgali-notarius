import { render, screen, within } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import App from './App';
import TrustSection from './TrustSection';
import {
  contacts,
  PRACTICE_SINCE,
  getYearsOfPractice,
  pluralizeYears,
  formatYearsOfPractice,
} from './config/contacts';

test('блок доверия содержит четыре плитки', () => {
  render(<TrustSection />);
  const list = screen.getByRole('list');
  expect(within(list).getAllByRole('listitem')).toHaveLength(4);
});

test('плитки покрывают лицензию, стаж, конфиденциальность и срок оформления', () => {
  render(<TrustSection />);
  expect(
    screen.getByText(new RegExp(`Лицензия №${contacts.notary.licenseNumber}`))
  ).toBeInTheDocument();
  expect(screen.getByText(new RegExp(`Опыт ${formatYearsOfPractice()}`))).toBeInTheDocument();
  expect(screen.getByText(/Конфиденциальность/)).toBeInTheDocument();
  expect(screen.getByText(/Оформление в день обращения/)).toBeInTheDocument();
});

test('стаж считается от года начала практики, а не хардкодится', () => {
  expect(PRACTICE_SINCE).toBe(2010);
  expect(contacts.notary.licenseSince).toBe(PRACTICE_SINCE);
  expect(getYearsOfPractice(new Date(2026, 0, 1))).toBe(16);
  expect(getYearsOfPractice(new Date(2031, 0, 1))).toBe(21);

  // Число в разметке совпадает с вычисленным на текущий год.
  render(<TrustSection />);
  expect(
    screen.getByText(new RegExp(String(getYearsOfPractice())))
  ).toBeInTheDocument();
});

test('склонение лет: год / года / лет', () => {
  expect(pluralizeYears(1)).toBe('год');
  expect(pluralizeYears(21)).toBe('год');
  expect(pluralizeYears(2)).toBe('года');
  expect(pluralizeYears(4)).toBe('года');
  expect(pluralizeYears(23)).toBe('года');
  expect(pluralizeYears(5)).toBe('лет');
  expect(pluralizeYears(11)).toBe('лет');
  expect(pluralizeYears(14)).toBe('лет');
  expect(pluralizeYears(15)).toBe('лет');
  expect(pluralizeYears(20)).toBe('лет');
  expect(pluralizeYears(100)).toBe('лет');
  expect(pluralizeYears(101)).toBe('год');
  expect(pluralizeYears(112)).toBe('лет');
});

test('формат стажа склеивает число и склонение', () => {
  expect(formatYearsOfPractice(new Date(2026, 0, 1))).toBe('16 лет');
  expect(formatYearsOfPractice(new Date(2031, 0, 1))).toBe('21 год');
  expect(formatYearsOfPractice(new Date(2032, 0, 1))).toBe('22 года');
});

test('секция доступна: aria-labelledby связан с заголовком', () => {
  render(<TrustSection />);
  const section = screen.getByRole('region', { name: /Почему обращаются/ });
  expect(section).toHaveAttribute('aria-labelledby', 'trust-title');
});

test('блок доверия стоит между hero и услугами', () => {
  render(<App />);
  const hero = screen.getByRole('region', { name: contacts.notary.fullName });
  const trust = screen.getByRole('region', { name: /Почему обращаются/ });
  const services = screen.getByRole('heading', { name: 'Нотариальные услуги' });

  // DOCUMENT_POSITION_FOLLOWING === 4: узел идёт после того, у кого вызван метод.
  expect(hero.compareDocumentPosition(trust)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(trust.compareDocumentPosition(services)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING
  );
});

test('сетка плиток раскрывается на 768px и 1200px, на мобилке — одна колонка', () => {
  const css = fs.readFileSync(path.join(__dirname, 'TrustSection.css'), 'utf8');

  // Базовое состояние (320px) — одна колонка.
  const base = css.match(/\.trust-grid\s*\{([\s\S]*?)\}/)[1];
  expect(base).toMatch(/grid-template-columns:\s*1fr/);

  expect(css).toMatch(/@media \(min-width: 768px\)[\s\S]*?repeat\(2, 1fr\)/);
  expect(css).toMatch(/@media \(min-width: 1200px\)[\s\S]*?repeat\(4, 1fr\)/);

  // Медиазапросы mobile-first: только min-width, без max-width.
  expect(css).not.toMatch(/max-width/);
});

test('иконки плиток не вращаются на hover', () => {
  const css = fs.readFileSync(path.join(__dirname, 'TrustSection.css'), 'utf8');
  expect(css).not.toMatch(/rotate\(/);
  expect(css).not.toMatch(/gradient/);
});
