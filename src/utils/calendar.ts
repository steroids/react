import moment from 'moment';

export const convertDate = (date: string | Date, fromFormats: string | string[], toFormat: string = null) => {
    if (!date) {
        return null;
    }

    let momentDate;

    if (typeof date === 'string' && fromFormats) {
        const validFormat = [].concat(fromFormats || []).find(format => (
            date
            && date.length === format.length
            && moment(date, format).isValid()
        ));
        if (!validFormat) {
            return null;
        }
        momentDate = moment(date, validFormat);
    } else if (date instanceof Date) {
        momentDate = moment(date);
    }

    if (!momentDate) {
        return null;
    }

    return toFormat ? momentDate.format(toFormat) : momentDate.toDate();
};

/**
 * Регулярка проверяет соответствие введенной строки формату 'hh:mm'
 * Максимальная величина - 23:59
 * @param time
 */
//const timeRegexp = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
//export const validateTime = (time: string) => time.match(timeRegexp) !== null;
