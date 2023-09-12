/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
 * Регулярка проверяет соответствие введенной строки формату 'hh:mm'
 * Максимальная величина - 23:59
 * @param time
 */
//const timeRegexp = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
//export const validateTime = (time: string) => time.match(timeRegexp) !== null;
