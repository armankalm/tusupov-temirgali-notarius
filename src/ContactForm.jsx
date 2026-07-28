

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
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    // Замените на ваш токен бота и chat_id
    const telegramBotToken = '5891037070:AAGbClS8krZmUsG0ZIEMs7gvOAzBbhdM_GI';
    const chatId = '1063624581';

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function validateForm() {
        let errors = {};
        if (!formData.name) errors.name = 'Введите имя';
        if (!formData.phone) errors.phone = 'Введите телефон';
        if (!formData.message) errors.message = 'Введите сообщение';
        return errors;
    }

    function Submit(e) {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            const text = `Имя: ${formData.name}\nТелефон: ${formData.phone}\nСообщение: ${formData.message}`;

            const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

            const data = {
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            };

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
                        console.log('Ошибка при отправке сообщения');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            setFormErrors(errors);
        }
    }

    return (
        <div className="contact-form-section">
            <div className="contact-form-card">
                {isDataSent ? (
                    <div className="contact-form-success">
                        <SuccessIcon />
                        <h3 className="contact-form-success-title">Отлично!</h3>
                        <p className="contact-form-success-text">Данные успешно отправлены. Мы свяжемся с вами в ближайшее время.</p>
                    </div>
                ) : (
                    <>
                        <div className="contact-form-header">
                            <h3 className="contact-form-title">Свяжитесь с нами</h3>
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
                            <button type="submit" className="contact-form-submit">
                                Отправить заявку
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default ContactForm;
