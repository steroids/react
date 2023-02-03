import {convertDate} from '../../src/utils/calendar';

describe('calendar utils', () => {
    const date = '1.1.2023';
    const fromFormats = 'D.M.YYYY';
    const utc = true;
    let toFormat = 'DD.MM.YY';

    it('default behavior', () => {
        const expectedFormatDate = '01.01.23';
        expect(convertDate(date, fromFormats, toFormat)).toBe(expectedFormatDate);
    });

    it('with utc', () => {
        const anotherDate = '1.1.2023 23:59';
        const anotherFromFormat = 'D.M.YYYY HH:mm';
        const expectedFormatDate = '01.01.23';
        expect(convertDate(anotherDate, anotherFromFormat, toFormat, utc)).toBe(expectedFormatDate);
    });

    it('with utc and dateInUtc', () => {
        const dateInUtc = true;
        const expectedFormatDate = '01.01.23';
        expect(convertDate(date, fromFormats, toFormat, utc, dateInUtc)).toBe(expectedFormatDate);
    });

    it('with date as Date instance', () => {
        const birthday = new Date(new Date().setFullYear(2000, 8, 3));
        toFormat = 'DD.MM.YYYY';
        expect(convertDate(birthday, fromFormats, toFormat)).toBe('03.09.2000');
    });
});
