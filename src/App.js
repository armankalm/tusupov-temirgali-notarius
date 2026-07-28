import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactForm from "./ContactForm";
import img1 from "./img/054f8a21-b5dd-4f7e-bef0-e0ca28309acd.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faHandshake, faScroll, faCheckCircle, faPen, faGavel, faRing, faCopy, faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { contacts } from "./config/contacts";

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
      <div className="container-fluid about-lawyer">
        <div className="container">
          <h2>{contacts.notary.title}</h2>
          <p className="fs-4 mb-2">{contacts.notary.fullName.toUpperCase()}</p>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>
            Действует на основании Лицензии №{contacts.notary.licenseNumber} выданной
            Министерством юстиции Республики Казахстан от {contacts.notary.licenseDate}.
          </p>
        </div>
      </div>

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
        <div className="mt-5">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default App;
