import {useCallback, useEffect, useMemo, useState} from 'react';
import {DayPickerProps} from 'react-day-picker';
import {useComponents} from '../../../hooks';
import {convertDate} from '../../../utils/calendar';

/**
 * Calendar
 *
 * Компонент календаря, который позволяет выбирать даты или диапазоны дат.
 * Он предоставляет пользователю удобный способ выбора даты и может использоваться для различных целей,
 * таких как выбор даты доставки, даты резервирования и т.д.
 *
 * Компонент `Calendar` позволяет указать значение даты или диапазона дат, формат значения, callback функцию при изменении,
 * свойства для компонента `DayPicker`, отображение панели выбора месяца/года, количество отображаемых месяцев и другие свойства.
 *
 * Если установлено значение `showFooter`, то будет отображаться футер с кнопкой "Today".
 */
export interface ICalendarProps extends IUiComponent {
    /**
     * Значение задает выбранные в календаре дату или диапазон дат.
     * Необходимо передать валидную дату в виде строки (массива строк)
     */
    value?: string | string[],

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueFormat?: string,

    /**
     * Функция возвращает выбранную в календаре дату
     */
    onChange?: (date: string) => void,

    /**
     * Свойства для компонента DayPickerInput
     * @example
     * {
     *   showWeekNumbers: true
     * }
     */
    pickerProps?: DayPickerProps | any,

    /**
     * Пропсы для компонента отображения
     */
    viewProps?: any,

    /**
     * Отображать Footer для календаря (содержит todayButton)
     */
    showFooter?: boolean,

    /**
     * Callback вызываемый при нажатии на кнопку 'Сегодня'
     * @param newDate - текущая дата
     */
    onTodayButtonClick?: (newDate: Date) => void,

    /**
     * Количество отображаемых за раз месяцев
     * @example 1
     */
    numberOfMonths?: number,

    /**
    * Callback вызываемый при нажатии на смену года или месяца в шапке Calendar
    * @param newDate - дата первого дня нового месяца
    */
    onMonthChange?: (newDate: Date) => void,
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
     * Функция изменения состояние отображения панели для выбора месяца/года
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

    const [month, setMonth] = useState<Date>(
        selectedDates.length > 0
            ? selectedDates.filter(date => !!date)[0]
            : new Date(),
    );
    const [isCaptionPanelVisible, setIsCaptionPanelVisible] = useState<boolean>(false);

    useEffect(() => {
        if (selectedDates.length > 0) {
            setMonth(selectedDates[0]);
        }
    }, [selectedDates]);

    const onDaySelect = useCallback((date) => {
        if (props.onChange) {
            props.onChange.call(null, convertDate(date, null, props.valueFormat, false, true));
        }

        if (props.onTodayButtonClick) {
            props.onTodayButtonClick(date);
            setMonth(date);
        }
    }, [props]);

    const toggleCaptionPanel = useCallback(() => {
        setIsCaptionPanelVisible(!isCaptionPanelVisible);
    }, [isCaptionPanelVisible]);

    const onMonthSelect = useCallback(newMonth => {
        setMonth(newMonth);
        if (props.onMonthChange) {
            props.onMonthChange(newMonth);
        }
    }, [props]);

    const viewProps = useMemo(() => ({
        month,
        toYear,
        fromYear,
        onDaySelect,
        onMonthSelect,
        selectedDates,
        toggleCaptionPanel,
        isCaptionPanelVisible,
        style: props.style,
        className: props.className,
        viewProps: props.viewProps,
        showFooter: props.showFooter,
        pickerProps: props.pickerProps,
        numberOfMonths: props.numberOfMonths,
    }), [fromYear, isCaptionPanelVisible, month, onDaySelect, onMonthSelect, props.className,
        props.numberOfMonths, props.pickerProps, props.showFooter, props.style, props.viewProps,
        selectedDates, toYear, toggleCaptionPanel]);

    return components.ui.renderView(props.view || 'content.CalendarView', viewProps);
}

Calendar.defaultProps = {
    numberOfMonths: 1,
    showFooter: true,
    valueFormat: 'YYYY-MM-DD',
};

export default Calendar;
