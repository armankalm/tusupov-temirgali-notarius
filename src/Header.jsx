import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

export default function Header() {
  return (
    <header className="modern-header">
      <div className="container">
        <div className="row align-items-center g-3">
          <div className="col-lg-4 col-md-12 text-center text-lg-start">
            <div className="header-brand">
              <h1 className="brand-name mb-1">Тусупов Темиргали Расович</h1>
              <p className="brand-subtitle mb-0">НОТАРИУС Г.ТАРАЗ</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="contact-info d-flex align-items-center justify-content-center gap-2">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="contact-details">
                <a href="tel:+77057372926" className="contact-link">
                  +7 (705) 737 2926
                </a>
                <div className="social-icons mt-1">
                  <a href="https://wa.me/+77057372926?text=Здравствуйте,%20интересуют%20нотариальные%20услуги."
                     className="social-link whatsapp" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                  <a href="https://t.me/+77057372926"
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
                <p className="location-city mb-0">г.Тараз</p>
                <p className="location-address mb-0">ул.Толе Би, 53</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
