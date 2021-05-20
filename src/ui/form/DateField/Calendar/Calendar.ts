import {useCallback, useMemo, useState} from 'react';
import {useComponents} from '@steroidsjs/core/hooks';
import useDateAndTime from '@steroidsjs/core/ui/form/DateField/useDateAndTime';

interface ICalendarProps {
    /**
     * Значение задает выбранные в календаре дату или диапазон дат.
     * Необходимо передать валидную дату в виде строки (массива строк)
     */
    calendarValue: string | string[],

    /**
     * Массив валидных форматов дат
     * @example ['DD.MM.YYYY']
     */
    dateValidFormats: string[],

    /**
     * Функция возвращает выбранную в календаре дату
     */
    onDayChange?: (day: Date) => void,

    /**
     * Свойства для компонента DayPickerInput
     * @example {dayPickerProps: {showWeekNumbers: true}}
     */
    pickerProps?: any;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;
}

export interface ICalendarViewProps extends ICalendarProps {
    /**
     * Текущий месяц календаря, также задает выбранный в календаре год
     */
    month: Date,

    /**
     * Самый крайний год в прошлом
     */
    fromYear: Date,

    /**
     * Самый крайний год в будущем
     */
    toYear: Date,

    /**
     * Фукнция обновляет значение выбранного месяца
     */
    updateMonth: (newMonth: Date) => void,

    /**
     * Хранит выбранную дату или диапазон дат
     */
    selectedDays: Date[],
}

function Calendar(props: ICalendarProps) {
    const components = useComponents();
    const {parseDate} = useDateAndTime({
        formatsArray: props.dateValidFormats,
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [month, setMonth] = useState<Date>(new Date(currentYear, currentMonth));

    const updateMonth = useCallback(newMonth => {
        setMonth(newMonth);
    }, []);

    const {fromYear, toYear} = useMemo(() => ({
        fromYear: new Date(currentYear - 100, 0),
        toYear: new Date(currentYear + 50, 11),
    }), [currentYear]);

    const selectedDays = useMemo(() => {
        if (Array.isArray(props.calendarValue)) {
            return props.calendarValue.map((str) => parseDate(str));
        }
        return [parseDate(props.calendarValue)];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.calendarValue]);

    return components.ui.renderView(props.view || 'form.CalendarView', {
        ...props,
        month,
        toYear,
        fromYear,
        updateMonth,
        selectedDays,
    });
}

export default Calendar;
