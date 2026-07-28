import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContactForm from './ContactForm';

function fill(labels) {
  Object.entries(labels).forEach(([label, value]) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  });
}

const VALID = {
  'Имя': 'Иван',
  'Телефон': '+7 705 000 00 00',
  'Сообщение': 'Нужна доверенность',
};

function submit() {
  fireEvent.click(screen.getByRole('button', { name: /Отправить|Отправляем/ }));
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('пустая отправка показывает ошибку у каждого поля и не шлёт запрос', () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  render(<ContactForm />);

  submit();

  expect(screen.getByText('Введите имя')).toBeInTheDocument();
  expect(screen.getByText('Введите телефон')).toBeInTheDocument();
  expect(screen.getByText('Введите сообщение')).toBeInTheDocument();
  expect(fetchSpy).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Имя')).toHaveAttribute('aria-invalid', 'true');
});

test('пробелы не считаются заполненным полем', () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  render(<ContactForm />);

  fill({ 'Имя': '   ', 'Телефон': '   ', 'Сообщение': '   ' });
  submit();

  expect(screen.getByText('Введите имя')).toBeInTheDocument();
  expect(fetchSpy).not.toHaveBeenCalled();
});

test('ошибка снимается сразу после исправления поля, а не после новой отправки', () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  render(<ContactForm />);

  submit();
  expect(screen.getByText('Введите имя')).toBeInTheDocument();

  fill({ 'Имя': 'Иван' });

  expect(screen.queryByText('Введите имя')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Имя')).toHaveAttribute('aria-invalid', 'false');
  // Остальные поля всё ещё с ошибками — снимается только исправленное.
  expect(screen.getByText('Введите телефон')).toBeInTheDocument();
});

test('валидная заявка уходит в Telegram и показывает экран успеха', async () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  render(<ContactForm />);

  fill(VALID);
  submit();

  expect(await screen.findByText('Отлично!')).toBeInTheDocument();

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  const [url, options] = fetchSpy.mock.calls[0];
  expect(url).toMatch(/api\.telegram\.org\/bot.+\/sendMessage/);
  const body = JSON.parse(options.body);
  expect(body.text).toContain('Иван');
  expect(body.text).toContain('Нужна доверенность');
});

test('символы < и > экранируются: parse_mode HTML иначе даёт 400', async () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  render(<ContactForm />);

  fill({ ...VALID, 'Сообщение': 'Договор <купли> & продажи' });
  submit();

  await waitFor(() => expect(fetchSpy).toHaveBeenCalled());

  const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
  expect(body.parse_mode).toBe('HTML');
  expect(body.text).toContain('&lt;купли&gt;');
  expect(body.text).toContain('&amp;');
  expect(body.text).not.toMatch(/<купли>/);
});

test('ответ не-ok показывает пользователю ошибку, а не молчит', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 400 });
  render(<ContactForm />);

  fill(VALID);
  submit();

  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(/Не удалось отправить/);
  // Экран успеха не показываем — заявка не ушла.
  expect(screen.queryByText('Отлично!')).not.toBeInTheDocument();
});

test('сетевая ошибка тоже сообщается пользователю', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network down'));
  render(<ContactForm />);

  fill(VALID);
  submit();

  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(/Не удалось отправить/);
  expect(screen.queryByText('Отлично!')).not.toBeInTheDocument();
});

test('после неудачи форму можно отправить повторно', async () => {
  const fetchSpy = jest
    .spyOn(global, 'fetch')
    .mockRejectedValueOnce(new Error('network down'))
    .mockResolvedValueOnce({ ok: true });
  render(<ContactForm />);

  fill(VALID);
  submit();
  await screen.findByRole('alert');

  submit();
  expect(await screen.findByText('Отлично!')).toBeInTheDocument();
  expect(fetchSpy).toHaveBeenCalledTimes(2);
});

test('экран успеха сохраняет id заголовка, на который ссылается секция', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });
  render(<ContactForm />);

  // До отправки id есть на заголовке формы.
  expect(screen.getByText('Свяжитесь с нами')).toHaveAttribute(
    'id',
    'contact-form-title'
  );

  fill(VALID);
  submit();

  // После отправки заголовок формы исчезает — id должен переехать,
  // иначе aria-labelledby секции в App.js указывает в пустоту.
  const success = await screen.findByText('Отлично!');
  expect(success).toHaveAttribute('id', 'contact-form-title');
});
