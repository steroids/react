import {useCallback, useEffect, useMemo, useState} from 'react';
import {useComponents} from '@steroidsjs/core/hooks';
import {convertDate} from '@steroidsjs/core/utils/calendar';

interface ICalendarProps {
    /**
     * Значение задает выбранные в календаре дату или диапазон дат.
     * Необходимо передать валидную дату в виде строки (массива строк)
     */
    value: string | string[],

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueFormat?: string;

    /**
     * Функция возвращает выбранную в календаре дату
     */
    onChange?: (date: string) => void,

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

    /**
     * Пропсы для компонента отображения
     */
    viewProps?: any;
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
     * Функция обновляет значение выбранного месяца
     */
    onMonthSelect: (date: Date) => void,

    /**
     * Функция возвращает выбранную в календаре дату
     */
    onDaySelect?: (date: Date) => void,

    /**
     * Хранит выбранную дату или диапазон дат
     */
    selectedDates: Date[],

    /**
     * Отображает панель для выбора месяца/года
     */
    isCaptionPanelVisible: boolean,

    /**
     * Функция измения состояние отображения панели для выбора месяца/года
     */
    toggleCaptionPanel: () => void,
}

function Calendar(props: ICalendarProps) {
    const components = useComponents();

    const currentYear = new Date().getFullYear();
    const {fromYear, toYear} = useMemo(() => ({
        fromYear: new Date(currentYear - 100, 0),
        toYear: new Date(currentYear + 50, 11),
    }), [currentYear]);

    const selectedDates = useMemo(
        () => [].concat(props.value || []).map(selectedDate => convertDate(selectedDate, props.valueFormat)),
        [props.value, props.valueFormat],
    );

    const [month, setMonth] = useState<Date>(selectedDates.length > 0 ? selectedDates[0] : new Date());
    const [isCaptionPanelVisible, setIsCaptionPanelVisible] = useState<boolean>(false);

    useEffect(() => {
        if (selectedDates.length > 0) {
            setMonth(selectedDates[0]);
        }
    }, [selectedDates]);

    const onDaySelect = useCallback(
        (date) => props.onChange.call(null, convertDate(date, null, props.valueFormat)),
        [props.onChange, props.valueFormat],
    );

    const toggleCaptionPanel = useCallback(() => {
        setIsCaptionPanelVisible(!isCaptionPanelVisible);
    }, [isCaptionPanelVisible]);

    const onMonthSelect = useCallback(newMonth => {
        setMonth(newMonth);
    }, []);

    return components.ui.renderView(props.view || 'content.CalendarView', {
        ...props.viewProps,
        month,
        toYear,
        fromYear,
        onDaySelect,
        onMonthSelect,
        selectedDates,
        toggleCaptionPanel,
        isCaptionPanelVisible,
    });
}

Calendar.defaultProps = {
    valueFormat: 'YYYY-MM-DD',
};

export default Calendar;
