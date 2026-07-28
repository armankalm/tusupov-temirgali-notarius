

import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="d-flex justify-content-center my-5">
            <div className="contact-form-card card p-5 shadow-xl" style={{ maxWidth: '600px', width: '100%', borderRadius: '16px', border: 'none' }}>
                {isDataSent ? (
                    <div className="success-message text-center">
                        <div className="success-icon mb-4">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.2"/>
                                <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 style={{ color: '#10b981', fontWeight: '700' }}>Отлично!</h3>
                        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Данные успешно отправлены. Мы свяжемся с вами в ближайшее время.</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-4">
                            <h3 style={{
                                fontSize: '2rem',
                                fontWeight: '600',
                                color: 'var(--primary-color)',
                                marginBottom: '0.5rem'
                            }}>
                                Свяжитесь с нами
                            </h3>
                            <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: 0 }}>
                                Оставьте свои контактные данные и мы вам перезвоним
                            </p>
                        </div>
                        <form onSubmit={Submit}>
                            <div className="form-group mb-4">
                                <label htmlFor="name" style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Имя</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        transition: 'all 0.3s ease'
                                    }}
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Введите ваше имя"
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="phone" style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Телефон</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        transition: 'all 0.3s ease'
                                    }}
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+7 (___) ___-__-__"
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                                {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="message" style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Сообщение</label>
                                <textarea
                                    className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        transition: 'all 0.3s ease',
                                        resize: 'vertical'
                                    }}
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Опишите ваш вопрос или какая услуга вас интересует"
                                    rows="4"
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                ></textarea>
                                {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
                            </div>
                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-lg"
                                    style={{
                                        background: 'var(--primary-color)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.875rem 2rem',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        borderRadius: '10px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 16px rgba(30, 58, 138, 0.4)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)';
                                    }}
                                >
                                    Отправить заявку
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default ContactForm;
