import * as React from 'react';
import {useCallback, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * TextField
 * Поле для ввода нескольких строк теста
 */
export interface ITextFieldProps extends IFieldWrapperInputProps {
    /**
     * Placeholder подсказка
     * @example Your text...
     */
    placeholder?: string;

    /**
     * Отправлять форму при нажатии на кнопку `enter`
     * @example true
     */
    submitOnEnter?: boolean;

    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    /**
     * Дополнительный CSS-класс для тега \<textarea\>
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    [key: string]: any;
}

export interface ITextFieldViewProps extends ITextFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        name: string,
        onChange: (value: string | React.ChangeEvent) => void,
        onKeyUp: (e: Event | React.KeyboardEvent) => void,
        value: string | number,
        placeholder: string,
        disabled: boolean,
    },
}

function TextField(props: ITextFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const dispatch = useDispatch();
    const components = useComponents();

    const onKeyUp = useCallback(e => {
        if (
            props.submitOnEnter
            && props.formId
            && e.keyCode === 13
            && !e.shiftKey
        ) {
            e.preventDefault();
            // TODO This is not worked in redux... =(
            // dispatch(submit(props.formId));
        }
    }, [dispatch, props.formId, props.submitOnEnter]);

    const onChange = useCallback(
        e => props.input.onChange.call(null, e.target ? e.target.value : e.nativeEvent.text),
        [props.input.onChange],
    );

    const inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value || '',
        onChange,
        onKeyUp,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [onKeyUp, onChange, props.disabled, props.input.name, props.input.value, props.inputProps, props.placeholder]);

    return components.ui.renderView(props.view || 'form.TextFieldView', {
        ...props,
        inputProps,
    });
}

TextField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    placeholder: '',
    submitOnEnter: false,
    errors: null,
};

export default fieldWrapper('TextField', TextField);
