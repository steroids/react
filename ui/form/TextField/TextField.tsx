import * as React from 'react';
import {useCallback, useMemo} from 'react';
import {submit} from 'redux-form';
import {useDispatch} from 'react-redux';
import {IFieldHocInput} from '../../../hoc/field';
import {useComponents} from '../../../hooks';
import {fieldWrapper, IFieldWrapperProps} from '../../../hooks/form';

export interface ITextFieldProps extends IFieldHocInput {
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
    inputProps?: any;
    className?: CssClassName;
    view?: CustomView;

    [key: string]: any;
}

export interface ITextFieldViewProps extends ITextFieldProps, IFieldWrapperProps {
    inputProps: {
        name: string,
        onChange: (value: string | React.ChangeEvent) => void,
        onKeyUp: (e: Event | React.KeyboardEvent) => void,
        value: string | number,
        placeholder: string,
        disabled: boolean,
    },
}

function TextField(props: ITextFieldProps & IFieldWrapperProps) {
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
            dispatch(submit(props.formId));
        }
    }, [dispatch, props.formId, props.submitOnEnter]);

    const onChange = useCallback(
        e => props.input.onChange(e.target ? e.target.value : e.nativeEvent.text),
        [props.input],
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
    errors: [],
};

export default fieldWrapper('TextField')(TextField);
