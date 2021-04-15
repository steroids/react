import * as React from 'react';
import {useMount} from 'react-use';
import {useMemo} from 'react';
import {useDispatch} from 'react-redux';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {useComponents} from '../../../hooks';

/**
 * CheckboxField
 * Одиночный чекбокс. Используется в формах для отметки булевого значения.
 */
export interface ICheckboxFieldProps extends IFieldWrapperInputProps {

    /**
     * Свойства для элемента \<input /\>
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    /**
     * Дополнительный CSS-класс для элемента \<input /\>
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизациии отображения
     * @example MyCustomView
     */
    view?: CustomView;

    [key: string]: any,
}

export interface ICheckboxFieldViewProps extends ICheckboxFieldProps, IFieldWrapperOutputProps {
    inputProps: {
        name: string,
        type: string,
        checked: boolean,
        onChange: (value: string | React.ChangeEvent) => void,
        disabled: boolean,
    }
}

function CheckboxField(props: ICheckboxFieldProps & IFieldWrapperOutputProps) {
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

export default fieldWrapper('CheckboxField', CheckboxField, {label: false});
