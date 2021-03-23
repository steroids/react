import * as React from 'react';
import {useCallback, useMemo} from 'react';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * InputField
 * Поле ввода текста
 */
export interface ITimeFieldProps extends IFieldWrapperInputProps {
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
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизациии отображения
     * @example MyCustomView
     */
    view?: any;

    /**
     * Объект CSS стилей
     * @example {width: '45%'}
     */
    style?: any;

    /**
     * Формат отображения времени
     * @example 'HH:mm'
     */
    timeFormat?: string,

    /**
     * Объект, который будет передан в props внутреннего компонента используемого для выбора времени.
     */
    pickerProps?: any;

    [key: string]: any;
}

export interface ITimeFieldViewProps extends ITimeFieldProps, IFieldWrapperOutputProps {
    style?: any,
    isInvalid?: boolean,
    errors?: any,
    placeholder?: string,
    timeFormat?: string,
    inputProps: {
        type: string,
        name: string,
        onChange: (value: string) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
    pickerProps: any,
    type: any,
}

function TimeField(props: ITimeFieldProps & IFieldWrapperOutputProps) {
    const components = useComponents();

    const onChange = useCallback(value => {
        props.input.onChange.call(null, value);
        if (props.onChange) {
            props.onChange.call(null, value);
        }
    }, [props.input.onChange, props.onChange]);
    // eslint-disable-line react-hooks/exhaustive-deps

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
        value: props.input.value || '',
        onChange,
    }), [onChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder,
        props.type]);

    return components.ui.renderView(props.view || 'form.TimeFieldView', {
        ...props,
        inputProps,
    });
}

TimeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    timeFormat: 'HH:mm',
    placeholder: '00:00',
};

export default fieldWrapper('TimeField', TimeField);
