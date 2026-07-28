import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactForm from "./ContactForm";
import TrustSection from "./TrustSection";
import img1 from "./img/054f8a21-b5dd-4f7e-bef0-e0ca28309acd.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faHandshake, faScroll, faCheckCircle, faPen, faGavel, faRing, faCopy, faBalanceScale, faPhone, faCalendarCheck, faCertificate } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { contacts, getWorkStatus } from "./config/contacts";

function Hero() {
  const status = getWorkStatus();

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

      <div className="container services-section">
        <div className="text-center">
          <h3>Нотариальные услуги</h3>
        </div>
        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="service-card card shadow h-100 text-center">
                <div className="card-body">
                  <FontAwesomeIcon icon={service.icon} className="fa-2x" />
                  <h5 className="card-title">{service.title}</h5>
                  <p className="card-text">{service.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid location-section">
        <div className="text-center">
          <h3>Расположение</h3>
        </div>
        <div className="location-content">
          <img src={img1} alt="Location" className="location-image" />
          <iframe
            src={mapEmbedUrl}
            width="500"
            height="670"
            className="location-map"
            allowFullScreen=""
            loading="lazy"
            title={`Карта расположения: ${contacts.address.full}`}
          ></iframe>
        </div>
        <div className="mt-5" id="contact-form">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default App;
