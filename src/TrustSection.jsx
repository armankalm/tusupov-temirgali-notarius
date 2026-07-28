import './TrustSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCertificate,
  faClockRotateLeft,
  faUserShield,
  faCalendarDay,
} from '@fortawesome/free-solid-svg-icons';
import { contacts, formatYearsOfPractice } from './config/contacts';

function TrustSection() {
  const experience = formatYearsOfPractice();

  const items = [
    {
      icon: faCertificate,
      title: `Лицензия №${contacts.notary.licenseNumber}`,
      text: `Выдана Министерством юстиции РК ${contacts.notary.licenseDate}.`,
    },
    {
      icon: faClockRotateLeft,
      title: `Опыт ${experience}`,
      text: `Нотариальная практика с ${contacts.notary.licenseSince} года — сделки, наследство, доверенности.`,
    },
    {
      icon: faUserShield,
      title: 'Конфиденциальность',
      text: 'Нотариальная тайна: сведения о сделке не передаются третьим лицам.',
    },
    {
      icon: faCalendarDay,
      title: 'Оформление в день обращения',
      text: 'Большинство документов удостоверяем сразу при наличии полного пакета.',
    },
  ];

  return (
    <section className="trust-section" aria-labelledby="trust-title">
      <div className="container">
        <h2 className="trust-title" id="trust-title">
          Почему обращаются к нам
        </h2>
        <ul className="trust-grid">
          {items.map((item) => (
            <li className="trust-card" key={item.title}>
              <FontAwesomeIcon
                icon={item.icon}
                className="trust-icon"
                aria-hidden="true"
              />
              <h3 className="trust-card-title">{item.title}</h3>
              <p className="trust-card-text">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TrustSection;
