// Единый источник правды по контактным данным нотариуса.
// Все компоненты берут адрес, телефон и график только отсюда.

const PHONE_RAW = '+77057372926';

export const contacts = {
  notary: {
    fullName: 'Тусупов Темиргали Расович',
    title: 'НОТАРИУС',
    licenseNumber: '0003207',
    licenseDate: '28 декабря 2010 года',
    licenseSince: 2010,
  },

  address: {
    city: 'Караганда',
    cityPrefixed: 'г. Караганда',
    street: 'проспект Бухар жырау',
    streetShort: 'пр. Бухар жырау',
    building: 'строение 49',
    buildingShort: 'стр. 49',
    // «пр. Бухар жырау, стр. 49»
    get lineShort() {
      return `${this.streetShort}, ${this.buildingShort}`;
    },
    // «г. Караганда, проспект Бухар жырау, строение 49»
    get full() {
      return `${this.cityPrefixed}, ${this.street}, ${this.building}`;
    },
  },

  phone: {
    raw: PHONE_RAW,
    display: '+7 (705) 737 2926',
    tel: `tel:${PHONE_RAW}`,
    whatsapp: `https://wa.me/${PHONE_RAW}`,
    whatsappWithText: `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(
      'Здравствуйте, интересуют нотариальные услуги.'
    )}`,
    telegram: `https://t.me/${PHONE_RAW}`,
  },

  email: 'tusupov_71@mail.ru',

  // Пн-Сб 9:00-18:00, обед 13:00-14:00, воскресенье выходной.
  schedule: {
    workDays: 'Пн-Сб',
    workHours: '9:00 - 18:00',
    lunchLabel: 'Обед',
    lunchHours: '13:00 - 14:00',
    dayOff: 'Вс: выходной',
    // Часы в 24-часовом формате — для вычисления статуса «открыто/обед/закрыто».
    opensAt: 9,
    closesAt: 18,
    lunchFrom: 13,
    lunchTo: 14,
    // Дни недели по Date.getDay(): 0 — воскресенье.
    dayOffIndex: 0,
    lines: ['Пн-Сб: 9:00 - 18:00', 'Обед: 13:00 - 14:00', 'Вс: выходной'],
  },
};

export default contacts;
