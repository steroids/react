import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useClickAway} from 'react-use';
import moment from 'moment';
import useDateAndTime from '@steroidsjs/core/ui/form/DateField/useDateAndTime';
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
    inputProps: {
        [key: string]: any,
    },
    isPanelVisible: boolean,
    setNow: () => void,
    openPanel: () => void,
    clearInput: () => void,
    closePanel: () => void,
    handlePanelClick: (newTime: string) => void,
}

function TimeField(props: ITimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const {validateTime, getNowTime} = useDateAndTime({});

    const [innerInput, setInnerInput] = useState<string>('');
    const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);

    const onChange = useCallback((value) => {
        setInnerInput(value);
        if (validateTime(value) && props.input.value !== value) {
            props.input.onChange.call(null, value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.value]);

    const handlePanelClick = useCallback((newTime) => {
        props.input.onChange.call(null, newTime);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setNow = useCallback(() => {
        props.input.onChange.call(null, getNowTime);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearInput = useCallback(() => {
        setInnerInput('');
        setIsPanelVisible(false);
        props.input.onChange.call(null, null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openPanel = useCallback(() => {
        if (!isPanelVisible) {
            setIsPanelVisible(true);
        }
    }, [isPanelVisible]);

    const closePanel = useCallback(() => {
        if (isPanelVisible) {
            setIsPanelVisible(false);
        }
        if (props.input.value !== innerInput) {
            setInnerInput(props.input.value || '');
        }
    }, [innerInput, isPanelVisible, props.input.value]);

    useEffect(() => {
        if (props.input.value && innerInput !== props.input.value) {
            setInnerInput(props.input.value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input.value]);

    const inputProps = useMemo(() => ({
        autoComplete: 'off',
        disabled: props.disabled,
        placeholder: props.placeholder,
        required: props.required,
        name: props.input.name,
        type: 'text',
        value: innerInput,
        onChange,
        ...props.inputProps,
    }), [innerInput, onChange, props.disabled, props.input.name, props.inputProps, props.placeholder, props.required]);

    return components.ui.renderView(props.view || 'form.TimeFieldView', {
        ...props,
        setNow,
        openPanel,
        closePanel,
        clearInput,
        inputProps,
        isPanelVisible,
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
