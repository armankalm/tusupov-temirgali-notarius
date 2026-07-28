import { useState } from 'react';
import './Faq.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { contacts } from './config/contacts';

// Bootstrap подключён только как CSS — аккордеон держим на useState,
// без его JS-плагина.
export const faqItems = [
  {
    id: 'documents',
    question: 'Какие документы нужны для сделки с недвижимостью?',
    answer:
      'Удостоверения личности всех сторон, правоустанавливающие документы на объект, ' +
      'справка о зарегистрированных правах и обременениях, при необходимости — ' +
      'согласие супруга. Полный список зависит от вида сделки, уточните по телефону.',
  },
  {
    id: 'price',
    question: 'Сколько стоят нотариальные услуги?',
    answer:
      'Тарифы установлены законом «О нотариате» и Нотариальной палатой: они одинаковы ' +
      'у всех нотариусов и зависят от вида действия и суммы сделки. Стоимость по вашему ' +
      'случаю назовём заранее, до начала оформления.',
  },
  {
    id: 'home-visit',
    question: 'Возможен ли выезд нотариуса на дом или в больницу?',
    answer:
      'Да. Если человек не может приехать в контору по состоянию здоровья, нотариус ' +
      'выезжает по адресу в пределах города. Дату и время согласовываем заранее.',
  },
  {
    id: 'terms',
    question: 'Сколько времени занимает оформление?',
    answer:
      'При полном пакете документов большинство действий — доверенности, согласия, ' +
      'копии, заявления — оформляем в день обращения, обычно за 20–40 минут. ' +
      'Сделки с недвижимостью занимают дольше из-за проверки документов.',
  },
  {
    id: 'inheritance',
    question: 'Как вступить в наследство?',
    answer:
      'Заявление о принятии наследства подаётся нотариусу в течение шести месяцев со дня ' +
      'смерти наследодателя. Понадобятся свидетельство о смерти, документы о родстве и ' +
      'сведения об имуществе. Свидетельство о праве на наследство выдаётся по истечении срока.',
  },
  {
    id: 'power-of-attorney',
    question: 'Нужно ли присутствие обеих сторон для доверенности?',
    answer:
      'Нет, доверенность удостоверяется в присутствии только доверителя. Достаточно его ' +
      'удостоверения личности и точных данных представителя — ИИН и Ф. И. О. по документу.',
  },
  {
    id: 'revoke',
    question: 'Можно ли отозвать доверенность или изменить завещание?',
    answer:
      'Да. Доверитель вправе отменить доверенность в любой момент, а завещатель — изменить ' +
      'или отменить завещание без объяснения причин. Отмена оформляется у нотариуса.',
  },
  {
    id: 'schedule',
    question: 'Нужна ли предварительная запись?',
    answer:
      `Приём ведётся в порядке живой очереди: ${contacts.schedule.workDays.toLowerCase()} ` +
      `${contacts.schedule.workHours}, перерыв ${contacts.schedule.lunchHours}. ` +
      'Чтобы не ждать, позвоните и запишитесь на удобное время.',
  },
];

function Faq() {
  const [openId, setOpenId] = useState(null);

  function toggle(id) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="container">
        <h2 className="faq-title" id="faq-title">
          Частые вопросы
        </h2>

        <ul className="faq-list">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li className="faq-item" key={item.id}>
                <h3 className="faq-question">
                  <button
                    type="button"
                    className="faq-trigger"
                    id={`faq-trigger-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => toggle(item.id)}
                  >
                    <span className="faq-trigger-text">{item.question}</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="faq-indicator"
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  className="faq-panel"
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-label={item.question}
                  hidden={!isOpen}
                >
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default Faq;
