import * as React from 'react';
import {ReactNode, useMemo} from 'react';
import {useMaskito} from '@maskito/react';
import {MaskitoOptions} from '@maskito/core';
import {maskitoDateOptionsGenerator} from '@maskito/kit';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {useComponents} from '../../../hooks';

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

type IElementInputType = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden'
    | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel'
    | 'text' | 'time' | 'url' | 'week' | string;

export interface IBaseFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Свойства для элемента input
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

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
        onChange: (value: any) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
    onClear?: () => void,
    onFocus?: (e: Event | React.FocusEvent) => void,
    onBlur?: (e: Event | React.FocusEvent) => void,
    onMouseDown?: (e: Event | React.MouseEvent) => void;
    maskedInputRef?: React.RefCallback<HTMLElement>;
    defaultValue?: string,
}

function InputField(props: IInputFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const maskedInputRef = useMaskito({
        options: props.maskOptions,
    });

    const onClear = React.useCallback(() => props.input.onChange(''), [props.input]);

    props.onClear = onClear;

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        value: props.input.value ?? '',
        onChange: value => props.input.onChange(value),
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps, props.placeholder, props.type]);

    // No render for hidden input
    if (props.type === 'hidden') {
        return null;
    }

    return components.ui.renderView(props.view || 'form.InputFieldView', {
        ...props,
        ...props.viewProps,
        inputProps,
        maskedInputRef,
    });
}

InputField.defaultProps = {
    type: 'text',
    size: 'md',
    disabled: false,
    required: false,
    showClear: false,
};

export default fieldWrapper<IInputFieldProps>('InputField', InputField);
