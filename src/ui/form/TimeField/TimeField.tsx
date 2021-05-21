import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway} from 'react-use';
import moment from 'moment';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * TimeField
 * Поле для выбора времени
 */
export interface ITimeFieldProps extends IFieldWrapperInputProps {

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

    [key: string]: any;
}

export interface ITimeFieldViewProps extends ITimeFieldProps, IFieldWrapperOutputProps {
    forwardedRef: any,
    style?: any,
    errors?: string[],
    placeholder?: string,
    type: any,
    inputProps: {
        type: string,
        name: string,
        onChange: (value: string) => void,
        value: string | number,
        placeholder: string,
        disabled: string,
    },
    isPanelVisible: boolean,
    openDropDown: () => void,
    closeDropDown: () => void,
    onBlur: () => void,
    clearInput: () => void,
    setNow: () => void,
    handlePanelClick: (newTime: string) => void,
}

function TimeField(props: ITimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const [innerInput, setInnerInput] = useState<string>('');
    const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);

    const onChange = useCallback((value) => {
        setInnerInput(value);
        // Регулярка проверяет соответствие введенной строки формату 'hh:mm'
        // Максимальная величина - 23:59
        const matchedValue = value.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/);
        if (matchedValue?.length > 0 && props.input.value !== value) {
            props.input.onChange.call(null, value);
        }
    }, [props.input.onChange, props.input.value]);

    const handlePanelClick = useCallback((newTime) => {
        props.input.onChange.call(null, newTime);
    }, [props.input.onChange]);

    const setNow = useCallback(() => {
        const timeNow = moment().format('hh:mm');
        props.input.onChange.call(null, timeNow);
    }, [props.input.onChange]);

    const clearInput = useCallback(() => {
        setInnerInput('');
        setIsPanelVisible(false);
        props.input.onChange.call(null, null);
    }, [props.input.onChange]);

    const onBlur = useCallback(() => {
        if (props.input.value !== innerInput) {
            setInnerInput(props.input.value);
        }
    }, [innerInput, props.input.value]);

    const openDropDown = useCallback(() => {
        if (!isPanelVisible) {
            setIsPanelVisible(true);
        }
    }, [isPanelVisible]);

    const closeDropDown = useCallback(() => {
        if (isPanelVisible) {
            setIsPanelVisible(false);
        }
    }, [isPanelVisible]);

    // Outside click -> close
    const forwardedRef = useRef(null);
    useClickAway(forwardedRef, closeDropDown);

    useEffect(() => {
        if (props.input.value && innerInput !== props.input.value) {
            setInnerInput(props.input.value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.value]);

    const inputProps = useMemo(() => ({
        type: props.type,
        name: props.input.name,
        placeholder: props.placeholder,
        disabled: props.disabled,
        value: innerInput,
        onChange,
        ...props.inputProps,
    }), [innerInput, onChange, props.disabled, props.input.name, props.inputProps, props.placeholder, props.type]);

    return components.ui.renderView(props.view || 'form.TimeFieldView', {
        ...props,
        setNow,
        onBlur,
        clearInput,
        inputProps,
        forwardedRef,
        isPanelVisible,
        openDropDown,
        closeDropDown,
        handlePanelClick,
    });
}

TimeField.defaultProps = {
    disabled: false,
    required: false,
    noBorder: false,
    showRemove: true,
    placeholder: 'Select time',
    type: 'text',
};

export default fieldWrapper('TimeField', TimeField);
