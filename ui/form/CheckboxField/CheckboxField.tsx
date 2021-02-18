import * as React from 'react';
import { useMount } from 'react-use';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { IFieldHocInput, IFieldHocOutput } from '../../../hoc/field';
import { IComponentsHocOutput } from '../../../hoc/components';
import { IConnectHocOutput } from '../../../hoc/connect';
import useField, { defineField } from '../../../hooks/field';
import { useComponents } from '../../../hooks';

/**
 * CheckboxField
 * Одиночный чекбокс. Используется в формах для отметки булевого значения.
 */
export interface ICheckboxFieldProps extends IFieldHocInput {

    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    className?: CssClassName;

    view?: CustomView;

    [key: string]: any,
}

export interface ICheckboxFieldViewProps extends ICheckboxFieldProps, IFieldHocOutput {
    inputProps: {
        name: string,
        type: string,
        checked: boolean,
        onChange: (value: string | React.ChangeEvent) => void,
        disabled: boolean,
    }
}

interface ICheckboxFieldPrivateProps extends IFieldHocOutput, IConnectHocOutput, IComponentsHocOutput {

}

function CheckboxField(props: ICheckboxFieldProps & ICheckboxFieldPrivateProps) {
    props = useField('CheckboxField', {
        ...props,
        layoutProps: {
            label: false,
        },
    });
    const components = useComponents();
    const dispatch = useDispatch();

    useMount(() => {
        if (props.input.value === undefined) {
            dispatch(props.input.onChange(false));
        }
    });

    props.inputProps = useMemo(() => ({
        name: props.input.name,
        type: 'checkbox',
        checked: !!props.input.value,
        onChange: () => props.input.onChange(!props.input.value),
        disabled: props.disabled,
        ...props.inputProps,
    }), [props.disabled, props.input, props.inputProps]);

    return components.ui.renderView(props.view || 'form.CheckboxFieldView', props);
}

CheckboxField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
};

export default defineField('CheckboxField')(CheckboxField);
