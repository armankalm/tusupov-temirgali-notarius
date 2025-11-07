import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faMapMarkerAlt, faEnvelope, faClock, faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-main">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="footer-section">
                <h3 className="footer-title">
                  <FontAwesomeIcon icon={faBalanceScale} className="me-2" />
                  О нотариусе
                </h3>
                <p className="footer-brand mb-3">Тусупов Темиргали Расович</p>
                <p className="footer-text">
                  Профессиональные нотариальные услуги с 2010 года. Гарантируем качество и конфиденциальность.
                </p>
                <div className="footer-license">
                  <small>Лицензия №0003207</small>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="footer-section">
                <h3 className="footer-title">
                  <FontAwesomeIcon icon={faPhone} className="me-2" />
                  Контакты
                </h3>
                <div className="footer-contact-item">
                  <FontAwesomeIcon icon={faPhone} className="footer-icon" />
                  <a href="tel:+77057372926" className="footer-link">+7 (705) 737 2926</a>
                </div>
                <div className="footer-contact-item">
                  <FontAwesomeIcon icon={faEnvelope} className="footer-icon" />
                  <span className="footer-text">notarius@taraz.kz</span>
                </div>
                <div className="footer-social">
                  <a href="https://wa.me/+77057372926" className="footer-social-link whatsapp" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                  <a href="https://t.me/+77057372926" className="footer-social-link telegram" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTelegram} />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="footer-section">
                <h3 className="footer-title">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                  Адрес и время работы
                </h3>
                <div className="footer-contact-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="footer-icon" />
                  <div>
                    <p className="mb-0 footer-text">г. Тараз</p>
                    <p className="mb-0 footer-text">ул. Толе Би, 53</p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <FontAwesomeIcon icon={faClock} className="footer-icon" />
                  <div>
                    <p className="mb-0 footer-text">Пн-Пт: 9:00 - 18:00</p>
                    <p className="mb-0 footer-text">Сб: 9:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 footer-copyright">
                © {currentYear} Тусупов Темиргали Расович. Все права защищены.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="mb-0 footer-powered">
                Нотариальные услуги в Таразе
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
