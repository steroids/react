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

    /**
     * Делает слайдер с двумя значениями
     * @example true
     */
    isRange?: boolean,

    /**
     * Длина шага слайдера
     * @example 10
     */
    step?: null | number;

    /**
     * Значение по-умолчанию при первом рендере
     * @example 1
     */
    defaultValue?: number | number[],

    /**
     * Отключет или включает слайдер
     * @example true
     */
    disabled?: boolean;

    /**
     * Мера измерения в всплывающем окне при изменении значения.
     */
    countFormat?: string | any | null,

    /**
     * Видимость окошка с выбранным значением.
     * @example true
     */
    tooltipIsVisible?: boolean,

    /**
     * Отметки
     */
    marks?: {number: React.ReactNode} | {number: { style, label }}

    /**
     * Делает слайдер верикального положения
     */
    isVertical: boolean,

    [key: string]: any;
}

export interface ISliderFieldViewProps extends ISliderFieldProps, IFieldWrapperOutputProps {

}

const normalizeValue = value => _toInteger(String(value).replace(/[0-9]g/, '')) || 0;

function SliderField(props: ISliderFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const slider = useMemo(() => ({
        min: props.min,
        max: props.max,
        step: props.step,
        marks: props.marks,
        isRange: props.isRange,
        disabled: props.disabled,
        isVertical: props.isVertical,
        value: props.input.value || 0,
        countFormat: props.countFormat,
        defaultValue: props.defaultValue,
        tooltipIsVisible: props.tooltipIsVisible,
        onChange: range => props.input.onChange.call(null, range),
        onAfterChange: value => {
            value = normalizeValue(value);
            props.input.onChange.call(null, value);
        },
    }), [props.min, props.max, props.step, props.marks, props.isRange, props.disabled, props.isVertical, props.input.value, props.input.onChange, props.countFormat, props.defaultValue, props.tooltipIsVisible]);

    return components.ui.renderView('form.SliderFieldView', {
        ...props,
        slider,
    });
}

SliderField.defaultProps = {
    tooltipIsVisible: true,
    disabled: false,
    required: false,
    isRange: false,
    className: '',
    countFormat: '',
    errors: null,
    step: 1,
    min: 0,
    max: 100,
};

export default fieldWrapper('SliderField', SliderField);
