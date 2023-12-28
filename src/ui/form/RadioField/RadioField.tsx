import * as React from 'react';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * RadioField
 *
 * Компонент RadioField представляет собой элемент выбора типа "radio". Он позволяет пользователю выбрать один вариант из нескольких предложенных.
 **/
export interface IRadioFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Свойства для элемента input
     * @example {onKeyDown: ...}
     */
    inputProps?: any,

    /**
     * Флаг определяющий включен ли элемент
     * @example {'true'}
     */
    checked?: boolean,

    [key: string]: any,
}

export interface IRadioFieldViewProps extends IRadioFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        name: string,
        type: string,
        checked: boolean,
        onChange: (value: string | React.ChangeEvent) => void,
        disabled: boolean,
    },
}

function RadioField(props: IRadioFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const onChangeHandler = React.useCallback(() => {
        props.input.onChange(!props.input.value);
        if (props.onChange) {
            props.onChange();
        }
    }, [props]);

    const inputProps = React.useMemo(() => ({
        name: props.input.name,
        type: 'radio',
        checked: !!props.input.value,
        onChange: onChangeHandler,
        disabled: props.disabled,
        ...props.inputProps,
    }), [onChangeHandler, props.disabled, props.input.name, props.input.value, props.inputProps]);

    return components.ui.renderView(props.view || 'form.RadioFieldView', {
        ...props,
        inputProps,
    });
}

RadioField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    size: 'md',
    inputProps: {},
};

export default fieldWrapper<IRadioFieldProps>('RadioField', RadioField);
