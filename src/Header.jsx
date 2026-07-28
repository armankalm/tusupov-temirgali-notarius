import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { contacts } from './config/contacts';
import './Header.css';

export default function Header() {
  return (
    <header className="modern-header">
      <div className="container">
        <div className="row align-items-center g-3">
          <div className="col-lg-4 col-md-12">
            {/* На мобилке — компактная полоса: имя слева, кнопка звонка справа.
                От 768px кнопка прячется, её роль берут развёрнутые контакты. */}
            <div className="header-compact">
              <div className="header-brand">
                <h1 className="brand-name mb-1">{contacts.notary.fullName}</h1>
                <p className="brand-subtitle mb-0">
                  НОТАРИУС Г.{contacts.address.city.toUpperCase()}
                </p>
              </div>
              <a
                className="header-call"
                href={contacts.phone.tel}
                aria-label={`Позвонить ${contacts.phone.display}`}
              >
                <FontAwesomeIcon icon={faPhone} />
              </a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="contact-info d-flex align-items-center justify-content-center gap-2">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="contact-details">
                <a href={contacts.phone.tel} className="contact-link">
                  {contacts.phone.display}
                </a>
                <div className="social-icons mt-1">
                  <a href={contacts.phone.whatsappWithText}
                     className="social-link whatsapp" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                  <a href={contacts.phone.telegram}
                     className="social-link telegram" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTelegram} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="location-info d-flex align-items-center justify-content-center justify-content-lg-end gap-2">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className="location-details">
                <p className="location-city mb-0">{contacts.address.cityPrefixed}</p>
                <p className="location-address mb-0">{contacts.address.lineShort}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
