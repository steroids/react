import {useCallback, useMemo, useState} from 'react';
import moment from 'moment';

interface IDateAndTimeInput {
    /**
     * Формат даты, показываемый пользователю
     * @example DD.MM.YYYY
     */
    displayFormat?: string,

    /**
     * Формат даты, отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueFormat?: string,

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
}

export default function useDateAndTime(props: IDateAndTimeInput): IDateAndTimeOutput {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const {fromYear, toYear} = useMemo(() => ({
        fromYear: new Date(currentYear - 100, 0),
        toYear: new Date(currentYear + 50, 11),
    }), [currentYear]);

    const [month, setMonth] = useState<Date>(new Date(currentYear, currentMonth));
    const [dateFrom, setDateFrom] = useState<Date>(null);
    const [dateTo, setDateTo] = useState<Date>(null);

    const updateMonth = useCallback(newMonth => {
        setMonth(newMonth);
    }, []);

    const updateDateFrom = useCallback(newDate => {
        setDateFrom(newDate);
    }, []);

    const updateDateTo = useCallback(newDate => {
        setDateTo(newDate);
    }, []);

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

    return {
        month,
        dateFrom,
        dateTo,
        toYear,
        fromYear,
        parseDate,
        formatDate,
        updateDateTo,
        updateMonth,
        updateDateFrom,
    };
}
