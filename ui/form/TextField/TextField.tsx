import * as React from 'react';
import { useMemo } from 'react';
import {submit} from 'redux-form';
import {useDispatch} from 'react-redux';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IConnectHocOutput} from '../../../hoc/connect';
import useField, { defineField } from '../../../hooks/field';
import { useComponents } from '../../../hooks';

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

export interface ITextFieldViewProps extends IFieldHocOutput {
    inputProps: {
        name: string,
        onChange: (value: string | React.ChangeEvent) => void,
        onKeyUp: (e: Event | React.KeyboardEvent) => void,
        value: string | number,
        placeholder: string,
        disabled: boolean,
    },
}

interface ITextFieldPrivateProps extends IFieldHocOutput, IConnectHocOutput, IComponentsHocOutput {

}

function TextField(props: ITextFieldProps & ITextFieldPrivateProps) {
    props = useField('TextField', props);

    const dispatch = useDispatch();
    const components = useComponents();

    const _onKeyUp = e => {
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
    };

    props.inputProps = useMemo(() => ({
        name: props.input.name,
        value: props.input.value || '',
        onChange: e => props.input.onChange(e.target ? e.target.value : e.nativeEvent.text),
        onKeyUp: _onKeyUp,
        placeholder: props.placeholder,
        disabled: props.disabled,
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps, props.placeholder]);

    return components.ui.renderView(props.view || 'form.TextFieldView', props);
}

TextField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    placeholder: '',
    submitOnEnter: false,
    errors: [],
};

export default defineField('TextField')(TextField);
