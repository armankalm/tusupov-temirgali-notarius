import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactForm from "./ContactForm";
import TrustSection from "./TrustSection";
import Faq from "./Faq";
import img1 from "./img/054f8a21-b5dd-4f7e-bef0-e0ca28309acd.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faHandshake, faScroll, faCheckCircle, faPen, faGavel, faRing, faCopy, faBalanceScale, faPhone, faCalendarCheck, faCertificate, faLocationDot, faDiamondTurnRight } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { contacts, getWorkStatus } from "./config/contacts";

function Hero() {
  // Статус считается от часов посетителя, поэтому во вкладке, открытой надолго,
  // он устаревает — пересчитываем раз в минуту.
  const [status, setStatus] = useState(() => getWorkStatus());

  useEffect(() => {
    const timer = setInterval(() => setStatus(getWorkStatus()), 60_000);
    return () => clearInterval(timer);
  }, []);

  function scrollToForm(e) {
    e.preventDefault();
    document.getElementById('contact-form')?.scrollIntoView({ block: 'start' });
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <p className="hero-eyebrow">{contacts.notary.title}</p>
        <h1 className="hero-title" id="hero-title">
          {contacts.notary.fullName}
        </h1>
        <p className="hero-subtitle">
          Нотариальные услуги в {contacts.address.city} — договоры, доверенности,
          наследство и заверение документов.
        </p>

        <div className="hero-cta">
          <a className="hero-btn hero-btn-primary" href={contacts.phone.tel}>
            <FontAwesomeIcon icon={faPhone} />
            Позвонить
          </a>
          <a
            className="hero-btn hero-btn-whatsapp"
            href={contacts.phone.whatsappWithText}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
            WhatsApp
          </a>
          <a className="hero-btn hero-btn-secondary" href="#contact-form" onClick={scrollToForm}>
            <FontAwesomeIcon icon={faCalendarCheck} />
            Записаться
          </a>
        </div>

        <p className={`hero-status hero-status-${status.state}`}>
          <span className="hero-status-dot" aria-hidden="true" />
          {status.label}
        </p>

        <ul className="hero-hours">
          {contacts.schedule.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="hero-license">
          <FontAwesomeIcon icon={faCertificate} aria-hidden="true" />
          Лицензия №{contacts.notary.licenseNumber} Министерства юстиции РК
          от {contacts.notary.licenseDate}
        </p>
      </div>
    </section>
  );
}

function App() {
  // Google Maps embed без API-ключа: поисковый запрос по актуальному адресу,
  // чтобы не хранить координаты руками.
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    contacts.address.full
  )}&hl=ru&z=17&output=embed`;

  const services = [
    { title: "Договоры", text: "Купля-продажа, дарение, мена, ипотека и др.", icon: faFileContract },
    { title: "Доверенности", text: "Представительство в суде, управление и распоряжение автомобилем и др.", icon: faHandshake },
    { title: "Завещания", text: "Удостоверение завещания и др.", icon: faScroll },
    { title: "Согласия", text: "На выезд несовершеннолетних и др.", icon: faCheckCircle },
    { title: "Заявления", text: "О принятии, выходе из гражданства и др.", icon: faPen },
    { title: "Наследство", text: "Открытие, принятие, отказ от наследства.", icon: faGavel },
    { title: "Брачный договор", text: "Составление брачного договора.", icon: faRing },
    { title: "Копии", text: "Копии уставов, договоров и других документов.", icon: faCopy },
    { title: "Юридические консультации", text: "Консультации по различным вопросам.", icon: faBalanceScale },
  ];

  return (
    <div>
      <Hero />

      <TrustSection />

      <section
        className="container services-section"
        aria-labelledby="services-title"
      >
        <div className="text-center">
          <h2 id="services-title">Нотариальные услуги</h2>
        </div>
        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="service-card card h-100 text-center">
                <div className="card-body">
                  <FontAwesomeIcon icon={service.icon} className="fa-2x" />
                  <h5 className="card-title">{service.title}</h5>
                  <p className="card-text">{service.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Faq />

      <section
        className="container-fluid location-section"
        aria-labelledby="location-title"
      >
        <div className="text-center">
          <h2 id="location-title">Расположение</h2>
        </div>
        <div className="location-content">
          <figure className="location-figure">
            <img
              src={img1}
              alt={`Вход в нотариальную контору: ${contacts.address.full}`}
              className="location-image"
              width="960"
              height="1280"
              loading="lazy"
            />
          </figure>

          <div className="location-map-column">
            <div className="location-map-frame">
              <iframe
                src={mapEmbedUrl}
                className="location-map"
                allowFullScreen=""
                loading="lazy"
                title={`Карта расположения: ${contacts.address.full}`}
              ></iframe>
            </div>

            {/* Адрес и график дублируются текстом: содержимое iframe поисковики не читают. */}
            <address
              className="location-details"
              role="group"
              aria-label="Адрес и часы работы"
            >
              <p className="location-address">
                <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
                {contacts.address.full}
              </p>
              <ul className="location-hours">
                {contacts.schedule.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <a
                className="location-route"
                href={contacts.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faDiamondTurnRight} aria-hidden="true" />
                Построить маршрут
              </a>
            </address>
          </div>
        </div>
      </section>

      <section
        className="mt-5"
        id="contact-form"
        aria-labelledby="contact-form-title"
      >
        <ContactForm />
      </section>
    </div>
  );
}

export default App;
