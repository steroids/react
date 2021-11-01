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
     * Значение по-умолчанию при первом рендере. Для isRange=false исполуется number, для isRange=true - number[]
     * @example 1
     */
    defaultValue?: number | number[],

    /**
     * Любое строкове значение после значения состояния слайдера в всплывающем окошке.
     * @example '%'
     */
    valuePostfix?: string,

    /**
     * Метки на ползунке. В объекте ({key: value}) key определяет положение, а value определяет, что будет отображаться.
     * Если вы хотите задать стиль определенной точки метки, значением должен быть объект,
     * содержащий свойства style и label.
     * @example { min: 20, 40: 40, max: 100 }
     */
    marks?: {number: React.ReactNode} | {number: { style, label }}

    /**
     * Функция, вызываемая после отпускания tip'а у слайдера (при событии onmouseup)
     * @see https://github.com/schrodinger/rc-slider
     * @example {() => console.log('Slider handler is released')}
     */
    onAfterChange?: (value: any) => void,

    [key: string]: any;
}

export interface ISliderFieldViewProps extends ISliderFieldProps, IFieldWrapperOutputProps {
    sliderDefaultValue?: number,
    rangeDefaultValue?: number[],
}

const normalizeValue = value => _toInteger(String(value).replace(/[0-9]g/, '')) || 0;

function SliderField(props: ISliderFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const sliderProps = useMemo(() => ({
        min: props.min,
        max: props.max,
        step: props.step,
        marks: props.marks,
        isRange: props.isRange,
        disabled: props.disabled,
        isVertical: props.isVertical,
        value: props.input.value || 0,
        valuePostfix: props.valuePostfix,
        defaultValue: props.defaultValue,
        tooltipIsVisible: props.tooltipIsVisible,
        onChange: range => props.input.onChange.call(null, range),
        onAfterChange: value => {
            value = normalizeValue(value);
            props.input.onChange.call(null, value);
        },
    }), [props.min, props.max, props.step, props.marks, props.isRange, props.disabled, props.isVertical, props.input.value, props.input.onChange, props.valuePostfix, props.defaultValue, props.tooltipIsVisible]);

    return components.ui.renderView('form.SliderFieldView', {
        ...props,
        sliderProps,
    });
}

SliderField.defaultProps = {
    step: 1,
    min: 0,
    max: 100,
    errors: null,
    className: '',
    valuePostfix: '',
    sliderDefaultValue: 5,
    rangeDefaultValue: [0, 10],
};

export default fieldWrapper('SliderField', SliderField);
