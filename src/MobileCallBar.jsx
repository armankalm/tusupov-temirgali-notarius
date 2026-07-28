import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { contacts } from './config/contacts';
import './MobileCallBar.css';

// Плавающая панель связи внизу экрана: видна только на мобилке,
// на десктопе скрыта — там те же действия есть в шапке и hero.
export default function MobileCallBar() {
  return (
    <nav className="mobile-call-bar" aria-label="Быстрая связь">
      <a className="mobile-call-btn mobile-call-btn-phone" href={contacts.phone.tel}>
        <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
        Позвонить
      </a>
      <a
        className="mobile-call-btn mobile-call-btn-whatsapp"
        href={contacts.phone.whatsappWithText}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" />
        WhatsApp
      </a>
    </nav>
  );
}
