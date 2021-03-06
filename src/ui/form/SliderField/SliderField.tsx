import * as React from 'react';
import _toInteger from 'lodash-es/toInteger';
import {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * SliderField
 * Компонент с ползунком для выбора числового значения в пределах указанного промежутка
 */
export interface ISliderFieldProps extends IFieldWrapperInputProps {
    /**
     * Свойства для компонента слайдера
     */
    sliderProps?: any;

    /**
     * Дополнительный CSS-класс для элемента отображения
     */
    className?: CssClassName;

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Минимальное значение в слайдере
     * @example 0
     */
    min?: number;

    /**
     * Максимальное значение в слайдере
     * @example 100
     */
    max?: number;

    [key: string]: any;
}

export interface ISliderFieldViewProps extends ISliderFieldProps, IFieldWrapperOutputProps {
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

function SliderField(props: ISliderFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const slider = useMemo(() => ({
        min: props.min,
        max: props.max,
        defaultValue: 0,
        value: props.input.value || 0,
        onChange: range => props.input.onChange.call(null, range),
        onAfterChange: value => {
            value = normalizeValue(value);
            props.input.onChange.call(null, value);
        },
    }), [props.min, props.max, props.input.value, props.input.onChange]);

    return components.ui.renderView('form.SliderFieldView', {
        ...props,
        slider,
    });
}

SliderField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    errors: null,
    min: 0,
    max: 100,
};

export default fieldWrapper('SliderField', SliderField);
