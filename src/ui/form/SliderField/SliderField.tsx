import React, {useCallback, useMemo} from 'react';
import _toInteger from 'lodash-es/toInteger';
import {useComponents} from '../../../hooks';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';

/**
 * SliderField
 * Компонент с ползунком для выбора числового значения в пределах указанного промежутка
 */
export interface ISliderFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
     * Свойства для компонента слайдера
     */
    sliderProps?: any,

    /**
     * Минимальное значение в слайдере
     * @example 0
     */
    min?: number,

    /**
     * Максимальное значение в слайдере
     * @example 100
     */
    max?: number,

    /**
     * Делает слайдер с двумя значениями
     * @example true
     */
    isRange?: boolean,

    /**
     * Длина шага слайдера
     * @example 10
     */
    step?: null | number,

    /**
     * Значение по-умолчанию при первом рендере. Для isRange=false используется number, для isRange=true - number[]
     * @example 1
     */
    defaultValue?: number | number[],

    /**
     * Любое строковое значение после значения состояния слайдера в всплывающем окошке.
     * @example '%'
     */
    valuePostfix?: string,

    /**
     * Метки на ползунке. В объекте '{'key: value'}' key определяет положение, а value определяет, что будет отображаться.
     * Если вы хотите задать стиль определенной точки метки, значением должен быть объект,
     * содержащий свойства style и label.
     * @example
     * {
     *  min: 20,
     *  40: 40,
     *  max: 100
     * }
     */
    marks?: Record<string, {style: {color,}, label,} | React.ReactNode | string>,

    /**
     * Функция, вызываемая в момент перетаскивания tip'а у слайдера
     * @example
     * {
     *  () => console.log('Slider is moving')
     * }
     */
    onChange?: (value: any) => void,

    /**
     * Функция, вызываемая после отпускания tip'а у слайдера (при событии onmouseup)
     * @see https://github.com/schrodinger/rc-slider
     * @example
     * {
     *  () => console.log('Slider handler is released')
     * }
     */
    onAfterChange?: (value: any) => void,

    [key: string]: any,
}

export interface ISliderFieldViewProps extends ISliderFieldProps, IFieldWrapperOutputProps {
    sliderDefaultValue?: number,
    rangeDefaultValue?: number[],
}

const normalizeValue = value => _toInteger(String(value).replace(/[0-9]g/, '')) || 0;

function SliderField(props: ISliderFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();

    const onChange = useCallback((value) => {
        if (props.onChange) {
            props.onChange(value);
        }

        props.input.onChange.call(null, value);
    }, [props]);

    const onAfterChange = useCallback((value) => {
        value = normalizeValue(value);

        if (props.onAfterChange) {
            props.onAfterChange(value);
        }

        props.input.onChange.call(null, value);
    }, [props]);

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
        onChange,
        onAfterChange,
    }), [onAfterChange, onChange, props.defaultValue, props.disabled, props.input.value, props.isRange,
        props.isVertical, props.marks, props.max, props.min, props.step, props.tooltipIsVisible, props.valuePostfix]);

    const viewProps = useMemo(() => ({
        ...sliderProps,
        slider: props.slider,
        className: props.className,
        rangeDefaultValue: props.rangeDefaultValue,
        sliderDefaultValue: props.sliderDefaultValue,
        style: props.style,
    }), [props.className, props.rangeDefaultValue, props.slider, props.sliderDefaultValue, props.style, sliderProps]);

    return components.ui.renderView(props.view || 'form.SliderFieldView', viewProps);
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

export default fieldWrapper<ISliderFieldProps>('SliderField', SliderField);
