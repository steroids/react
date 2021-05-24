import {useCallback} from 'react';
import moment from 'moment';

interface IDateAndTimeInput {
    /**
     * Массив валидных форматов
     */
    formatsArray?: string[],
}

export interface IDateAndTimeOutput {
    /**
     * Задает месяц для отображения в календаре
     */
    month?: Date,

    /**
     * Выбранный в календаре день
     */
    dateFrom?: Date,

    /**
    * Выбранный диапазон дней
    */
    dateTo?: Date,

    /**
     * Для диапазона с годами - задает начало
     */
    fromYear?: Date,

    /**
     * Для диапазона с годами - задает конец
     */
    toYear?: Date,

    /**
     * Срабатывает при изменении месяца или года в календаре.
     * Обновляет значение month
     * @param {Date} newDate
     */
    updateMonth?: (newDate: Date) => void,

    /**
     * Срабатывает при нажатии на день в календаре.
     * Обновляет значение selectedDays
     * @param {string | Date} date
     */
    updateDateFrom?: (newDate: Date) => void,

    /**
     * Обновление выбранного диапазона дат
     * @param {DatesRange} newRange
     */
    updateDateTo?: (newDate: Date) => void,

    /**
     * Конвертирует дату из string в Date
     * @param {string | Date} date
     * @returns {Date|undefined}
     */
    parseDate?: (date: Date | string) => Date | undefined,

    /**
     * Конвертирует дату в строку определенного формата
     * @param {string | Date} date
     * @param {string} format
     * @returns {string}
     */
    formatDate?: (date: Date | string, format: string) => string,

    /**
     * Проверяет, содержит ли переданная строка время в правильном формате
     * @param {string} time
     * @returns {boolean}
     */
    validateTime?: (time: string) => boolean,

    /**
     * Возвращает отметку времени (время берется в момент вызова функции) в виде строки
     * @returns {string}
     */
    getNowTime?: () => string
}

export default function useDateAndTime(props: IDateAndTimeInput): IDateAndTimeOutput {
    const parseDate = useCallback(date => {
        const validFormat = props.formatsArray.find(
            format => (
                date
                && date.length === format.length
                && moment(date, format).isValid()
            ),
        );
        return validFormat ? moment(date, validFormat).toDate() : undefined;
    }, [props.formatsArray]);

    const formatDate = useCallback((date, format) => {
        if (!date) {
            return date;
        }
        return moment(date).format(format);
    }, []);

    const validateTime = useCallback((time: string) => {
        // Регулярка проверяет соответствие введенной строки формату 'hh:mm'
        // Максимальная величина - 23:59
        const matchedValue = time.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/);
        return Array.isArray(matchedValue) && matchedValue.length > 0;
    }, []);

    const getNowTime = useCallback(() => moment().format('hh:mm'), []);

    return {
        parseDate,
        formatDate,
        getNowTime,
        validateTime,
    };
}
