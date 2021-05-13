import {useCallback, useMemo, useRef, useState} from 'react';
import {DateUtils} from 'react-day-picker';
import moment from 'moment';

interface DatesRange {
    to: Date,
    from: Date,
}

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
    selectedDays?: Date,

    /**
    * Выбранный диапазон дней
    */
    selectedRange?: DatesRange,

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
    handleYearMonthChange?: (newDate: Date) => void,

    /**
     * Срабатывает при нажатии на день в календаре.
     * Обновляет значение selectedDays
     * @param {string | Date} date
     */
    handleDayClick?: (newDate: Date) => void,

    /**
     * Обновление выбранного диапазона дат
     * @param {DatesRange} newRange
     */
    updateRange?: (newRange: DatesRange) => DatesRange,

    /**
     * Вспомогательная функция, возвращает новый диапазон дат
     * Обновляется в зависимости от переданного значения (даты)
     * @param {DatesRange} newRange
     */
    addDateToRange?: (date: Date) => DatesRange,

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
    const [selectedDays, setSelectedDays] = useState<Date>(null);

    const selectedRange = useRef(({
        from: undefined,
        to: undefined,
    }));

    const handleYearMonthChange = useCallback(newMonth => {
        setMonth(newMonth);
    }, []);

    const handleDayClick = useCallback(newDate => {
        setSelectedDays(newDate);
    }, []);

    const updateRange = useCallback((newRange: DatesRange) => {
        selectedRange.current = newRange;
        return newRange;
    }, []);

    const addDateToRange = useCallback((date) => DateUtils.addDayToRange(date, selectedRange.current), [selectedRange]);

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
        toYear,
        fromYear,
        parseDate,
        formatDate,
        selectedDays,
        selectedRange: selectedRange.current,
        handleDayClick,
        updateRange,
        handleYearMonthChange,
        addDateToRange,
    };
}
