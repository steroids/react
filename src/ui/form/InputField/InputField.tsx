/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import * as React from 'react';
import {InputHTMLAttributes, ReactNode, useMemo} from 'react';
import {useMaskito} from '@maskito/react';
import {MaskitoOptions} from '@maskito/core';
import {maskitoDateOptionsGenerator} from '@maskito/kit';
import {ISaveCursorPositionDebounceConfig} from '@steroidsjs/core/hooks/useSaveCursorPosition';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {useComponents, useSaveCursorPosition} from '../../../hooks';
import {INPUT_TYPES_SUPPORTED_SELECTION, useInputFieldWarningByType} from './hooks/useInputFieldWarningByType';
import {FieldEnum} from '../../../enums';

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

export type IElementInputType = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden'
    | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel'
    | 'text' | 'time' | 'url' | 'week' | string;

export interface IBaseFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Свойства для элемента input
     * @example { onKeyDown: ... }
     */
    inputProps?: InputHTMLAttributes<HTMLInputElement>,

    /**
     * Показывать иконку очищения поля
     * @example true
    */
    showClear?: boolean,

    /**
     * Callback-функция, которая вызывается при очистке input
     */
    onClear?: (value: string) => void,

    /**
     * Свойства для компонента отображения
     * @example
     * {
     *  customHandler: () => {...}
     * }
     */
    viewProps?: {
        [key: string]: any,
    },
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
    type?: IElementInputType,

    /**
     * Изображение или React-нода, которая будет отрендерена слева от поля.
     * @example require('icon.png') | <component/>
     */
    textBefore?: number | ReactNode | string,

    /**
     * Изображение или React-нода, которая будет отрендерена справа от поля.
     * @example require('icon.png') | '<component/>'
     */
    textAfter?: number | ReactNode | string,

    /**
     * Текст или React-нода, которая будет отрендерена слева от поля.
     * @example 'http://'
     */
    addonBefore?: ReactNode | string,

    /**
     * Текст или React-нода, которая будет отрендерена справа от поля.
     * @example '.com'
     */
    addonAfter?: ReactNode | string,

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
    leadIcon?: React.ReactElement | string,

    /**
     * Задержка применения введённого значения
     */
    debounce?: boolean | ISaveCursorPositionDebounceConfig,

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
    onMouseDown?: (e: Event | React.MouseEvent) => void,
    defaultValue?: string,
}

function InputField(props: IInputFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const maskedInputRef = useMaskito({
        options: props.maskOptions,
    });

    const {inputRef, onChange, value} = useSaveCursorPosition({
        inputParams: props.input,
        onChangeCallback: props.onChange,
        debounce: {
            enabled: !!props.debounce,
            ...(typeof props.debounce === 'boolean' ? {enabled: props.debounce} : (props.debounce ?? {})),
        },
    });

    React.useEffect(() => {
        if (inputRef.current) {
            maskedInputRef(inputRef.current);
        }
    }, [inputRef, maskedInputRef]);

    useInputFieldWarningByType(props.type);

    const onClear = React.useCallback(() => {
        if (props.onClear) {
            props.onClear('');
        }

        props.input.onChange('');
    }, [props]);

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        value,
        onInput: onChange,
        placeholder: props.placeholder,
        ...props.inputProps,
    }), [value, onChange, props.input.name, props.inputProps, props.placeholder, props.type]);

    const viewProps = useMemo(() => ({
        inputRef: INPUT_TYPES_SUPPORTED_SELECTION.includes(props.type) ? inputRef : null,
        onClear,
        inputProps,
        size: props.size,
        errors: props.errors,
        leadIcon: props.leadIcon,
        showClear: props.showClear,
        input: props.input,
        addonAfter: props.addonAfter,
        addonBefore: props.addonBefore,
        textAfter: props.textAfter,
        textBefore: props.textBefore,
        className: props.className,
        style: props.style,
        onBlur: props.onBlur,
        onFocus: props.onFocus,
        onMouseDown: props.onMouseDown,
        placeholder: props.placeholder,
        required: props.required,
        id: props.id,
        viewProps: props.viewProps,
        disabled: props.disabled,
    }), [inputProps, inputRef, onClear, props]);

    // No render for hidden input
    if (props.type === 'hidden') {
        return null;
    }

    return components.ui.renderView(props.view || 'form.InputFieldView', viewProps);
}

InputField.defaultProps = {
    type: 'text',
    disabled: false,
    required: false,
    showClear: false,
    maskOptions: null,
};

export default fieldWrapper<IInputFieldProps>(FieldEnum.INPUT_FIELD, InputField);
