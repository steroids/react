import {useCallback, useMemo} from 'react';
import moment from 'moment';
import useDateAndTime, {IDateAndTimeOutput} from '@steroidsjs/core/ui/form/DateField/useDateAndTime';
import {convertDate} from '@steroidsjs/core/utils/calendar';
import useDateTime from '@steroidsjs/core/ui/form/DateField/useDateTime';
import {ITimePanelViewProps} from '@steroidsjs/bootstrap/form/TimeField/TimePanelView';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';

/**
 * DateTimeField
 * Поля ввода с выпадающими списками для выбора даты и времени
 */
export interface IDateTimeFieldProps extends IFieldWrapperInputProps {

    /**
     * Формат показываемый пользователю
     * @example DD.MM.YYYY HH:mm
     */
    displayFormat?: string;

    /**
     * Формат отправляемый на сервер
     * @example YYYY-MM-DD HH:mm
     */
    valueFormat?: string;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    [key: string]: any;
}

export interface IDateTimeFieldViewProps extends IDateAndTimeOutput {
    dateValue: any,
    timeValue: any,
    onDateSelect: any,
    onTimeSelect: any,
    calendarProps: {
        value: string,
        valueFormat: string,
        onChange: (value: string) => void,
    },
    timePanelProps: any,
}

const DATE_TIME_SEPARATOR = ' ';

function DateTimeField(props: IDateTimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const {
        isOpened,
        onClose,
        inputProps,
        onClear,
        onNow,
    } = useDateAndTime({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        input: props.input,
        onChange: props.onChange,
        disabled: props.disabled,
        placeholder: props.placeholder,
        required: props.required,
        inputProps: props.inputProps,
    });

    const {
        dateValueFormat,
        dateValue,
        timeValue,
        onDateSelect,
        onTimeSelect,
    } = useDateTime({
        displayFormat: props.displayFormat,
        valueFormat: props.valueFormat,
        DATE_TIME_SEPARATOR,
        input: props.input,
    });

    // Calendar props
    const calendarProps = useMemo(() => ({
        value: dateValue,
        onChange: onDateSelect,
        valueFormat: dateValueFormat,
    }), [dateValue, dateValueFormat, onDateSelect]);

    // TimePanel props
    const timePanelProps: ITimePanelViewProps = useMemo(() => ({
        onNow,
        onClose,
        value: timeValue,
        onSelect: onTimeSelect,
    }), [onClose, onNow, onTimeSelect, timeValue]);

    return components.ui.renderView(props.view || 'form.DateTimeFieldView', {
        ...props.viewProps,
        isOpened,
        onClose,
        inputProps,
        onClear,
        onNow,
        timeValue,
        onTimeSelect,
        calendarProps,
        timePanelProps,
        size: props.size,
        icon: props.icon,
        errors: props.errors,
        showRemove: props.showRemove,
        className: props.className,
    });
}

DateTimeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayFormat: 'DD.MM.YYYY' + DATE_TIME_SEPARATOR + 'HH:mm',
    valueFormat: 'YYYY-MM-DD' + DATE_TIME_SEPARATOR + 'HH:mm',
};

export default fieldWrapper('DateTimeField', DateTimeField);
