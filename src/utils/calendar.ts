/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const convertDate = (
    date: string | Date,
    fromFormats: string | string[],
    toFormat: string = null,
    isUtc = false,
    dateInUtc = false,
) => {
    if (!date) {
        return null;
    }

    let dayjsDate;

    if (typeof date === 'string' && fromFormats) {
        const validFormat = [].concat(fromFormats || []).find(format => (
            date
            && date.length === format.length
            && dayjs(date, format).isValid()
        ));

        if (!validFormat) {
            return null;
        }

        if (dateInUtc) {
            dayjsDate = dayjs(date, validFormat).utc(true);
        } else {
            dayjsDate = dayjs(date, validFormat);
        }
    } else if (date instanceof Date) {
        dayjsDate = dayjs(date);
    }

    if (!dayjsDate) {
        return null;
    }

    if (isUtc) {
        dayjsDate = dayjsDate.utc();
    }

    return toFormat ? dayjsDate.format(toFormat) : dayjsDate.toDate();
};

/**
 * Функции форматирования для локализации Day Picker.
 */

const WEEKDAYS_LONG = {
    en: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ],
    ru: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
    ],
};
const WEEKDAYS_SHORT = {
    en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    ru: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
};
const MONTHS = {
    en: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    ru: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
};

const FIRST_DAY = {
    en: 0,
    ru: 1, // Use Monday as first day of the week
};

const formatDay = (day: Date, locale?: string) => `${WEEKDAYS_LONG[locale][day.getDay()]}, ${day.getDate()} ${
    MONTHS[locale][day.getMonth()]
} ${day.getFullYear()}`;

const formatMonthTitle = (month: Date, locale?: string) => `${MONTHS[locale][month.getMonth()]} ${month.getFullYear()}`;

const formatWeekdayShort = (weekday: number, locale?: string) => WEEKDAYS_SHORT[locale][weekday];

const formatWeekdayLong = (weekday: number, locale?: string) => WEEKDAYS_SHORT[locale][weekday];

const getFirstDayOfWeek = (locale?: string) => FIRST_DAY[locale];

const getMonths = (locale?: string) => MONTHS[locale];

export const customLocaleUtils = {
    formatDay,
    formatMonthTitle,
    formatWeekdayShort,
    formatWeekdayLong,
    getFirstDayOfWeek,
    getMonths,
};

/**
 * Регулярка проверяет соответствие введенной строки формату 'hh:mm'
 * Максимальная величина - 23:59
 * @param time
 */
//const timeRegexp = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
//export const validateTime = (time: string) => time.match(timeRegexp) !== null;
