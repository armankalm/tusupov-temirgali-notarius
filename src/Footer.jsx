import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faMapMarkerAlt, faEnvelope, faClock, faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { contacts } from './config/contacts';
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
                <p className="footer-brand mb-3">{contacts.notary.fullName}</p>
                <p className="footer-text">
                  Профессиональные нотариальные услуги с {contacts.notary.licenseSince} года.
                  Гарантируем качество и конфиденциальность.
                </p>
                <div className="footer-license">
                  <small>Лицензия №{contacts.notary.licenseNumber}</small>
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
                  <a href={contacts.phone.tel} className="footer-link">{contacts.phone.display}</a>
                </div>
                <div className="footer-contact-item">
                  <FontAwesomeIcon icon={faEnvelope} className="footer-icon" />
                  <a href={`mailto:${contacts.email}`} className="footer-link">{contacts.email}</a>
                </div>
                <div className="footer-social">
                  <a href={contacts.phone.whatsapp} className="footer-social-link whatsapp" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                  <a href={contacts.phone.telegram} className="footer-social-link telegram" target="_blank" rel="noopener noreferrer">
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
                    <p className="mb-0 footer-text">{contacts.address.cityPrefixed}</p>
                    <p className="mb-0 footer-text">{contacts.address.lineShort}</p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <FontAwesomeIcon icon={faClock} className="footer-icon" />
                  <div>
                    {contacts.schedule.lines.map((line) => (
                      <p className="mb-0 footer-text" key={line}>{line}</p>
                    ))}
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
                © {currentYear} {contacts.notary.fullName}. Все права защищены.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="mb-0 footer-powered">
                Нотариальные услуги в Караганде
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
