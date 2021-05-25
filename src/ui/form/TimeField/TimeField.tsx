import {useCallback} from 'react';
import moment from 'moment';
import useDateAndTime, {IDateAndTimeOutput} from '@steroidsjs/core/ui/form/DateField/useDateAndTime';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * TimeField
 * Поле для выбора времени
 */
export interface ITimeFieldProps extends IFieldWrapperInputProps {
    /**
     * Формат времени, показываемый пользователю
     * @example mm:hh
     */
    displayFormat?: string;

    /**
     * Формат времени, отправляемый на сервер
     * @example mm:hh
     */
    valueFormat?: string;

    /**
     * Включить возможность сброса значения
     * @example 'true'
     */
    showRemove?: boolean,

    /**
     * Отключить border вокруг элемента
     * @example 'true'
     */
    noBorder?: boolean,

    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: string;

    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: any;

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Иконка
     * @example times-circle
     */
    icon?: string | boolean;

    [key: string]: any;
}

export interface ITimeFieldViewProps extends IDateAndTimeOutput,
    Pick<ITimeFieldProps, 'size' | 'errors' | 'showRemove' | 'noBorder' | 'className'>
{
    onSelect: any,
    [key: string]: any;
}

function TimeField(props: ITimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
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

    return components.ui.renderView(props.view || 'form.TimeFieldView', {
        ...props.viewProps,
        isOpened,
        inputProps,
        onNow,
        onClear,
        onClose,
        size: props.size,
        icon: props.icon,
        errors: props.errors,
        showRemove: props.showRemove,
        noBorder: props.noBorder,
        className: props.className,
    });
}

TimeField.defaultProps = {
    disabled: false,
    required: false,
    noBorder: false,
    showRemove: true,
    placeholder: 'Select time',
    type: 'text',
    displayFormat: 'HH:mm',
    valueFormat: 'HH:mm',
};

export default fieldWrapper('TimeField', TimeField);
