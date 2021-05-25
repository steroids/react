import {useMemo} from 'react';
import useDateAndTime, {IDateAndTimeOutput} from './useDateAndTime';
import {useComponents} from '../../../hooks';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps,
} from '../../form/Field/fieldWrapper';

/**
 * DateField
 * Поле ввода с выпадающим календарём для выбора даты
 */
export interface IDateFieldProps extends IFieldWrapperInputProps {
    /**
     * Формат даты показываемый пользователю
     * @example DD.MM.YYYY
     */
    displayFormat?: string;

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueFormat?: string;

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: any;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Иконка
     * @example calendar-day
     */
    icon?: string | boolean;

    showRemove?: boolean,

    inputProps?: Record<string, unknown>,
    viewProps?: Record<string, unknown>,

    [key: string]: any;
}

export interface IDateFieldViewProps extends IDateAndTimeOutput,
    Pick<IDateFieldProps, 'size' | 'icon' | 'errors' | 'showRemove' | 'className'>
{
    calendarProps: {
        value: string,
        valueFormat: string,
        onChange: (value: string) => void,
    },
    [key: string]: any;
}

function DateField(props: IDateFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const {
        isOpened,
        onClose,
        inputProps,
        onClear,
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

    // Calendar props
    const calendarProps = useMemo(() => ({
        value: props.input.value,
        onChange: props.input.onChange,
        valueFormat: props.valueFormat,
    }), [props.input.onChange, props.input.value, props.valueFormat]);

    return components.ui.renderView(props.view || 'form.DateFieldView', {
        ...props.viewProps,
        isOpened,
        onClose,
        inputProps,
        onClear,
        calendarProps,
        size: props.size,
        icon: props.icon,
        errors: props.errors,
        showRemove: props.showRemove,
        className: props.className,
    });
}

DateField.defaultProps = {
    disabled: false,
    displayFormat: 'DD.MM.YYYY',
    valueFormat: 'YYYY-MM-DD',
    icon: true,
    required: false,
    showRemove: true,
};

export default fieldWrapper('DateField', DateField);
