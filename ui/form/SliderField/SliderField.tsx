import * as React from 'react';
import _toInteger from 'lodash-es/toInteger';
import {useMemo} from 'react';
import {IFieldHocInput} from '../../../hoc/field';
import {useComponents} from '../../../hooks';
import {fieldWrapper, IFieldWrapperProps} from '../../../hooks/form';

export interface ISliderFieldProps extends IFieldHocInput {
    sliderProps?: any;
    className?: CssClassName;
    view?: CustomView;
    min?: number;
    max?: number;

    [key: string]: any;
}

export interface ISliderFieldViewProps extends ISliderFieldProps, IFieldWrapperProps {
    slider: {
        min: number,
        max: number,
        defaultValue: number,
        value: number,
        onChange: (value: any) => void,
        onAfterChange: (value: any) => void,
    }
}

const normalizeValue = value => _toInteger(String(value).replace(/[0-9]g/, '')) || 0;

function SliderField(props: ISliderFieldProps & IFieldWrapperProps) {
    const components = useComponents();

    const slider = useMemo(() => ({
        min: props.min,
        max: props.max,
        defaultValue: 0,
        value: props.input.value || 0,
        onChange: range => props.input.onChange(range),
        onAfterChange: value => {
            value = normalizeValue(value);
            props.input.onChange(value);
        },
    }), [props.input, props.min, props.max]);

    return components.ui.renderView('form.SliderFieldView', {
        ...props,
        slider,
    });
}

SliderField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    errors: [],
    min: 0,
    max: 100,
};

export default fieldWrapper('SliderField')(SliderField);
