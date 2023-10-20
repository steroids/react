/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import * as React from 'react';
import {InputHTMLAttributes, ReactNode, useMemo} from 'react';
import {useMaskito} from '@maskito/react';
import {MaskitoOptions} from '@maskito/core';
import {maskitoDateOptionsGenerator} from '@maskito/kit';
import {useMount} from 'react-use';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import EmailField from '../EmailField/EmailField';

const INPUT_TYPES_SUPPORTED_SELECTION = ['text', 'search', 'tel', 'url', 'password'];

const INPUT_TYPES_REPLACEMENT_HASH = {
    email: 'EmailField',
    date: 'DateField',
    month: 'DateField',
    week: 'CalendarSystem',
    time: 'DateTimeField',
    'datetime-local': 'DateField',
    number: 'NumberField',
    range: 'SliderField',
    checkbox: 'CheckboxField',
    radio: 'RadioField',
    button: 'Button',
    file: 'FileField',
    submit: 'Button',
    image: 'Button',
    reset: 'Button',
};

export const MASK_PRESETS = {
    date: maskitoDateOptionsGenerator({
        mode: 'dd/mm/yyyy',
    }),
    phone: {
        mask: [
            '+',
            '7',
            ' ',
            '(',
            ...Array(3).fill(/\d/),
            ')',
            ' ',
            ...Array(3).fill(/\d/),
            '-',
            ...Array(2).fill(/\d/),
            ' ',
            ...Array(2).fill(/\d/),
        ],
    },
    card: {
        mask: [
            ...Array(4).fill(/\d/),
            '-',
            ...Array(4).fill(/\d/),
            '-',
            ...Array(4).fill(/\d/),
            '-',
            ...Array(4).fill(/\d/),
        ],
    },
};

export const CUSTOM_FIELDS_HASH = {
    email: EmailField,
};

type IElementInputType = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden'
    | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel'
    | 'text' | 'time' | 'url' | 'week' | string;

export interface IBaseFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Свойства для элемента input
     * @example {onKeyDown: ...}
     */
    inputProps?: InputHTMLAttributes<HTMLInputElement>;

    /**
     * Показывать иконку очищения поля
     * @example true
    */
    showClear?: boolean;

    /**
     * Свойства для компонента отображения
     * @example {customHandler: () => {...}}
     */
    viewProps?: {
        [key: string]: any,
    };
}

/**
 * InputField
 * Поле ввода текста
 */
export interface IInputFieldProps extends IBaseFieldProps {
    /**
     * HTML Тип
     * @example email
     */
    type?: IElementInputType;

    /**
     * Изображение или React-нода, которая будет отрендерена слева от поля.
     * @example require('icon.png') | <component/>
     */
    textBefore?: number | ReactNode | string;

    /**
     * Изображение или React-нода, которая будет отрендерена справа от поля.
     * @example require('icon.png') | <component/>
     */
    textAfter?: number | ReactNode | string;

    /**
     * Текст или React-нода, которая будет отрендерена слева от поля.
     * @example 'http://'
     */
    addonBefore?: ReactNode | string;

    /**
     * Текст или React-нода, которая будет отрендерена справа от поля.
     * @example '.com'
     */
    addonAfter?: ReactNode | string;

    /**
     * Конфигурация маски
     * @example: {
         mask: [
             ...Array(4).fill(/\d/),
             '-',
             ...Array(4).fill(/\d/),
             '-',
             ...Array(4).fill(/\d/),
             '-',
             ...Array(4).fill(/\d/),
         ],
        }
     */
    maskOptions?: MaskitoOptions,

    /**
     * Пользовательская иконка svg или название иконки
     */
    leadIcon?: React.ReactElement | string;
}

export interface IInputFieldViewProps extends IInputFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        type: string,
        name: string,
        onInput: (event: any, value?: string) => void,
        value: string | number,
        placeholder: string,
        disabled: boolean,
    },
    onClear?: () => void,
    onFocus?: (e: Event | React.FocusEvent) => void,
    onBlur?: (e: Event | React.FocusEvent) => void,
    onMouseDown?: (e: Event | React.MouseEvent) => void;
    defaultValue?: string,
}

function InputField(props: IInputFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const maskedInputRef = useMaskito({
        options: props.maskOptions,
    });

    const {inputRef, onChange} = useSaveCursorPosition(
        props.input,
    );

    React.useEffect(() => {
        if (inputRef.current) {
            maskedInputRef(inputRef.current);
        }
    }, [inputRef, maskedInputRef]);

    useMount(() => {
        if (!INPUT_TYPES_SUPPORTED_SELECTION.includes(props.type)) {
            const recommendedUiComponent = `<${INPUT_TYPES_REPLACEMENT_HASH[props.type]} />`;

            INPUT_TYPES_REPLACEMENT_HASH[props.type]
                ? console.warn(`<InputField /> with "${props.type}" type does not support setSelectionRange() method. Try to use ${recommendedUiComponent} instead.`)
                : console.warn(`< InputField /> with "${props.type}" type does not support setSelectionRange() method.Try to use predefined Steroids component.`);
        }
    });

    const onClear = React.useCallback(() => props.input.onChange(''), [props.input]);

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        value: props.input.value ?? '',
        onInput: onChange,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [onChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder, props.type]);

    // No render for hidden input
    if (props.type === 'hidden') {
        return null;
    }

    return components.ui.renderView(props.view || 'form.InputFieldView', {
        ...props,
        ...props.viewProps,
        inputProps,
        // If type was recognized as unsupported in InputField, then we do not pass ref.
        inputRef: INPUT_TYPES_SUPPORTED_SELECTION.includes(props.type) ? inputRef : null,
        onClear,
    });
}

InputField.defaultProps = {
    type: 'text',
    size: 'md',
    disabled: false,
    required: false,
    showClear: false,
    maskOptions: null,
};

export default fieldWrapper<IInputFieldProps>('InputField', InputField);
