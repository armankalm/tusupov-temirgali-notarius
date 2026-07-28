

import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ContactForm.css';

function SuccessIcon() {
    return (
        <svg
            className="contact-form-success-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle className="success-icon-bg" cx="12" cy="12" r="10" />
            <path className="success-icon-check" d="M9 12l2 2 4-4" />
        </svg>
    );
}

function ContactForm() {
    const [isDataSent, setIsDataSent] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    // Замените на ваш токен бота и chat_id
    const telegramBotToken = '5891037070:AAGbClS8krZmUsG0ZIEMs7gvOAzBbhdM_GI';
    const chatId = '1063624581';

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Ошибку снимаем сразу, как только поле заполнили: иначе подсказка
        // и aria-invalid висят на уже исправленном поле до следующей отправки.
        setFormErrors((prev) => {
            if (!prev[name] || !value.trim()) return prev;
            const { [name]: _removed, ...rest } = prev;
            return rest;
        });
    }

    function validateForm() {
        let errors = {};
        if (!formData.name.trim()) errors.name = 'Введите имя';
        if (!formData.phone.trim()) errors.phone = 'Введите телефон';
        if (!formData.message.trim()) errors.message = 'Введите сообщение';
        return errors;
    }

    // Заявка уходит с parse_mode: 'HTML', поэтому «<», «>» и «&» из полей
    // нужно экранировать — иначе Telegram отвечает 400 и заявка теряется.
    function escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function Submit(e) {
        e.preventDefault();
        if (isSending) return;

        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            setSubmitError('');
            return;
        }

        const text =
            `Имя: ${escapeHtml(formData.name)}\n` +
            `Телефон: ${escapeHtml(formData.phone)}\n` +
            `Сообщение: ${escapeHtml(formData.message)}`;

        const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        const data = {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        };

        setIsSending(true);
        setSubmitError('');

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    setIsDataSent(true);
                } else {
                    throw new Error(`Telegram ответил ${response.status}`);
                }
            })
            .catch(() => {
                // Молча терять заявку нельзя: показываем ошибку и запасной канал связи.
                setSubmitError(
                    'Не удалось отправить заявку. Позвоните нам или напишите в WhatsApp.'
                );
            })
            .finally(() => {
                setIsSending(false);
            });
    }

    return (
        <div className="contact-form-section">
            <div className="contact-form-card">
                {isDataSent ? (
                    <div className="contact-form-success">
                        <SuccessIcon />
                        {/* Тот же id, что и у заголовка формы: секция ссылается на него
                            через aria-labelledby, и после отправки он не должен пропасть. */}
                        <h2 className="contact-form-success-title" id="contact-form-title">Отлично!</h2>
                        <p className="contact-form-success-text">Данные успешно отправлены. Мы свяжемся с вами в ближайшее время.</p>
                    </div>
                ) : (
                    <>
                        <div className="contact-form-header">
                            <h2 className="contact-form-title" id="contact-form-title">Свяжитесь с нами</h2>
                            <p className="contact-form-subtitle">
                                Оставьте свои контактные данные и мы вам перезвоним
                            </p>
                        </div>
                        <form onSubmit={Submit} noValidate>
                            <div className="contact-form-group">
                                <label className="contact-form-label" htmlFor="name">Имя</label>
                                <input
                                    type="text"
                                    className={`contact-form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Введите ваше имя"
                                    aria-invalid={Boolean(formErrors.name)}
                                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                                />
                                {formErrors.name && <span className="contact-form-error" id="name-error">{formErrors.name}</span>}
                            </div>
                            <div className="contact-form-group">
                                <label className="contact-form-label" htmlFor="phone">Телефон</label>
                                <input
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    className={`contact-form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+7 (___) ___-__-__"
                                    aria-invalid={Boolean(formErrors.phone)}
                                    aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                                />
                                {formErrors.phone && <span className="contact-form-error" id="phone-error">{formErrors.phone}</span>}
                            </div>
                            <div className="contact-form-group">
                                <label className="contact-form-label" htmlFor="message">Сообщение</label>
                                <textarea
                                    className={`contact-form-control ${formErrors.message ? 'is-invalid' : ''}`}
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Опишите ваш вопрос или какая услуга вас интересует"
                                    rows="4"
                                    aria-invalid={Boolean(formErrors.message)}
                                    aria-describedby={formErrors.message ? 'message-error' : undefined}
                                ></textarea>
                                {formErrors.message && <span className="contact-form-error" id="message-error">{formErrors.message}</span>}
                            </div>
                            {submitError && (
                                <p className="contact-form-submit-error" role="alert">
                                    {submitError}
                                </p>
                            )}
                            <button
                                type="submit"
                                className="contact-form-submit"
                                disabled={isSending}
                            >
                                {isSending ? 'Отправляем…' : 'Отправить заявку'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default ContactForm;
