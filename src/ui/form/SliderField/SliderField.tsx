import * as React from 'react';
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
     * Отметки
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
}

function SliderField(props: ISliderFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const slider = useMemo(() => ({
        min: props.min,
        max: props.max,
        step: props.step,
        marks: props.marks,
        isRange: props.isRange,
        disabled: props.disabled,
        onChange: props.onChange,
        onAfterChange: props.onAfterChange,
        isVertical: props.isVertical,
        value: props.input.value || 0,
        valuePostfix: props.valuePostfix,
        defaultValue: props.defaultValue,
        tooltipIsVisible: props.tooltipIsVisible,
    }), [
        props.min,
        props.max,
        props.step,
        props.marks,
        props.isRange,
        props.disabled,
        props.onChange,
        props.onAfterChange,
        props.isVertical,
        props.input.value,
        props.valuePostfix,
        props.defaultValue,
        props.tooltipIsVisible,
    ]);

    return components.ui.renderView('form.SliderFieldView', {
        ...props,
        slider,
    });
}

SliderField.defaultProps = {
    className: '',
    valuePostfix: '',
    errors: null,
    step: 1,
    min: 0,
    max: 100,
};

export default fieldWrapper('SliderField', SliderField);
