import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useDateAndTime from '@steroidsjs/core/ui/form/DateField/useDateAndTime';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../../form/Field/fieldWrapper';
import {useComponents} from '../../../hooks';
/**
 * DateTimeField
 * Поля ввода с выпадающими списками для выбора даты и времени
 */
export interface IDateTimeFieldProps extends IFieldWrapperInputProps {

    /**
     * Формат даты показываемый пользователю
     * @example DD.MM.YYYY
     */
    displayDateFormat?: string;

    /**
     * Формат даты отправляемый на сервер
     * @example YYYY-MM-DD
     */
    valueDateFormat?: string;

    /**
     * Формат времени
     * @example HH:mm
     */
    timeFormat?: string;

    /**
     * Пропсы для компонента DateField
     * @example {placeholder: 'Your date...'}
     */
    dateProps?: any;

    /**
     * Пропсы для компонента TimeField
     * @example {placeholder: 'Your time...'}
     */
    timeProps?: any;

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

export interface IDateTimeFieldViewProps extends IDateTimeFieldProps, IFieldWrapperOutputProps {
    innerInput: string,
    isPanelOpen: boolean,
    openPanel: () => void,
    closePanel: () => void,
    onTimePanelClick: () => void,
}

function DateTimeField(props: IDateTimeFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();
    const {
        parseDate,
        formatDate,
        validateTime,
    } = useDateAndTime({
        formatsArray: [
            props.displayFormat,
            props.valueFormat,
        ],
    });

    const [innerInput, setInnerInput] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

    const openPanel = useCallback(() => {
        if (!isPanelOpen) {
            setIsPanelOpen(true);
        }
    }, [isPanelOpen]);

    const closePanel = useCallback(() => {
        if (isPanelOpen) {
            setIsPanelOpen(false);
        }
    }, [isPanelOpen]);

    const onChange = useCallback(value => {
        setInnerInput(value);
    }, []);

    const onTimePanelClick = useCallback((value) => {
    }, []);

    useEffect(() => {
        if (props.input.value) {
        }
    }, [props.input.value]);

    const inputProps = useMemo(() => ({
        autoComplete: 'off',
        disabled: props.disabled,
        placeholder: props.placeholder || props.displayDateFormat,
        required: props.required,
        name: props.input.name,
        type: 'text',
        value: innerInput,
        onChange,
        ...props.inputProps,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [innerInput, props.disabled, props.input.name, props.inputProps, props.placeholder, props.required]);

    return components.ui.renderView(props.view || 'form.DateTimeFieldView', {
        ...props,
        openPanel,
        closePanel,
        inputProps,
        isPanelOpen,
        onTimePanelClick,
    });
}

DateTimeField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    displayDateFormat: 'DD.MM.YYYY',
    valueDateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
};

export default fieldWrapper('DateTimeField', DateTimeField);
