import * as React from 'react';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';
import useField, { defineField } from '../../../hooks/field';
import { useComponents } from '../../../hooks';
import { useMemo } from 'react';

export interface ISliderFieldProps extends IFieldHocInput {
    sliderProps?: any;
    className?: CssClassName;
    view?: CustomView;
    min?: number;
    max?: number;
    [key: string]: any;
}

export interface ISliderFieldViewProps extends IFieldHocOutput {
    slider: {
        min: number,
        max: number,
        defaultValue: number,
        value: number,
        onChange: (value: any) => void,
        onAfterChange: (value: any) => void,
    }
}

interface ISliderFieldPrivateProps extends IFieldHocOutput, IComponentsHocOutput {

}

const normalizeValue = value => {
    return parseInt(String(value).replace(/[0-9]g/, '')) || 0;
};

function SliderField(props: ISliderFieldProps & ISliderFieldPrivateProps) {
    props = useField('SliderField', props);

    const components = useComponents();

    props.slider = useMemo(() => ({
        min: props.min,
        max: props.max,
        defaultValue: 0,
        value: props.input.value || 0,
        onChange: range => props.input.onChange(range),
        onAfterChange: value => {
            value = normalizeValue(value);
            props.input.onChange(value);
        },
    }), [props.input, props.inputProps, props.min, props.max, props.step]);

    return components.ui.renderView('form.SliderFieldView', props);
}

SliderField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    errors: [],
    min: 0,
    max: 100,
};

export default defineField('SliderField')(SliderField);
