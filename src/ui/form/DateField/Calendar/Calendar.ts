import {useCallback, useMemo, useState} from 'react';
import {useComponents} from '@steroidsjs/core/hooks';
import useDateAndTime from '@steroidsjs/core/ui/form/DateField/useDateAndTime';

interface ICalendarProps {
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
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;
    onDayChange?: any,
    value?: string,
}

export interface ICalendarViewProps extends ICalendarProps {
    onDayClick: any,
    selectedDay: Date,
    month: Date,
    updateMonth: any,
    fromYear: any,
    toYear: any,
}

function Calendar(props: ICalendarProps) {
    const components = useComponents();
    const {parseDate} = useDateAndTime({
        formatsArray: [
            props.displayFormat,
            props.valueFormat,
        ],
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const {fromYear, toYear} = useMemo(() => ({
        fromYear: new Date(currentYear - 100, 0),
        toYear: new Date(currentYear + 50, 11),
    }), [currentYear]);
    const [month, setMonth] = useState<Date>(new Date(currentYear, currentMonth));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const selectedDay = useMemo(() => parseDate(props.value), [props.value]);

    const updateMonth = useCallback(newMonth => {
        setMonth(newMonth);
    }, []);

    const onDayClick = useCallback((day: Date) => {
        props.onDayChange(day);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return components.ui.renderView(props.view || 'form.CalendarView', {
        ...props,
        month,
        fromYear,
        toYear,
        onDayClick,
        updateMonth,
        selectedDay,
    });
}

export default Calendar;
