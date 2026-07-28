// Единый источник правды по контактным данным нотариуса.
// Все компоненты берут адрес, телефон и график только отсюда.

const PHONE_RAW = '+77057372926';
// wa.me принимает только цифры — ведущий «+» ломает ссылку.
const PHONE_DIGITS = PHONE_RAW.replace(/\D/g, '');

// Начало нотариальной практики — стаж считается от этой даты, а не хардкодится.
// Месяц по Date: 11 — декабрь. Дата лицензии: 28 декабря 2010 года.
export const PRACTICE_SINCE = 2010;
const PRACTICE_START_MONTH = 11;
const PRACTICE_START_DAY = 28;

export const contacts = {
  notary: {
    fullName: 'Тусупов Темиргали Расович',
    title: 'НОТАРИУС',
    licenseNumber: '0003207',
    licenseDate: '28 декабря 2010 года',
    licenseSince: PRACTICE_SINCE,
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
    // Маршрут в Google Maps по тому же адресу, что и в embed-карте.
    get directionsUrl() {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        this.full
      )}`;
    },
  },

  phone: {
    raw: PHONE_RAW,
    display: '+7 (705) 737 2926',
    tel: `tel:${PHONE_RAW}`,
    whatsappWithText: `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(
      'Здравствуйте, интересуют нотариальные услуги.'
    )}`,
    // Telegram: t.me принимает только @username или invite-хэш, номер телефона
    // в этом пути даёт битую ссылку. Ссылку вернём, когда заказчик сообщит username.
    telegram: null,
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
    // Строки для вывода собираются из полей выше — чтобы график правился в одном месте.
    get lines() {
      return [
        `${this.workDays}: ${this.workHours}`,
        `${this.lunchLabel}: ${this.lunchHours}`,
        this.dayOff,
      ];
    },
  },
};

// Статус приёма на момент `now` по графику из contacts.schedule.
// Возвращает { state, label } — state: 'open' | 'lunch' | 'closed'.
export function getWorkStatus(now = new Date()) {
  const { schedule } = contacts;
  const hours = now.getHours() + now.getMinutes() / 60;

  if (now.getDay() === schedule.dayOffIndex) {
    return { state: 'closed', label: 'Закрыто — воскресенье выходной' };
  }
  if (hours >= schedule.lunchFrom && hours < schedule.lunchTo) {
    return { state: 'lunch', label: `Обед до ${schedule.lunchTo}:00` };
  }
  if (hours >= schedule.opensAt && hours < schedule.closesAt) {
    return { state: 'open', label: 'Открыто сейчас' };
  }

  // До открытия — откроемся сегодня; после закрытия — в следующий рабочий день.
  // Вечер субботы отдельный случай: следующий приём в понедельник, а не «в 9:00».
  if (hours < schedule.opensAt) {
    return { state: 'closed', label: `Закрыто — откроемся в ${schedule.opensAt}:00` };
  }
  const nextDay = (now.getDay() + 1) % 7;
  const label =
    nextDay === schedule.dayOffIndex
      ? `Закрыто — откроемся в понедельник в ${schedule.opensAt}:00`
      : `Закрыто — откроемся завтра в ${schedule.opensAt}:00`;
  return { state: 'closed', label };
}

// Стаж в годах на момент `now` — считается от даты лицензии, чтобы не устаревал.
// Год засчитывается только после годовщины: до 28 декабря стаж на год меньше.
export function getYearsOfPractice(now = new Date()) {
  const years = now.getFullYear() - PRACTICE_SINCE;
  const month = now.getMonth();
  const day = now.getDate();
  const anniversaryPassed =
    month > PRACTICE_START_MONTH ||
    (month === PRACTICE_START_MONTH && day >= PRACTICE_START_DAY);

  return anniversaryPassed ? years : years - 1;
}

// Склонение «год / года / лет» по правилам русского счёта.
// 1, 21, 31 — год; 2-4, 22-24 — года; 5-20, 11-14 — лет.
export function pluralizeYears(count) {
  const abs = Math.abs(count) % 100;
  const last = abs % 10;

  if (abs > 10 && abs < 20) return 'лет';
  if (last === 1) return 'год';
  if (last >= 2 && last <= 4) return 'года';
  return 'лет';
}

// «15 лет» — готовая строка для вывода стажа.
export function formatYearsOfPractice(now = new Date()) {
  const years = getYearsOfPractice(now);
  return `${years} ${pluralizeYears(years)}`;
}

export default contacts;
