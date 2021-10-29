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
     * Дополнительный CSS-класс для элемента отображения
     * @example 'large'
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
     * @example '%'
     */
    countFormat?: string | any | null,

    /**
     * Отметки
     * @example { min: 20, 40: 40, max: 100 }
     */
    marks?: {number: React.ReactNode} | {number: { style, label }}

    /**
     * Вызваемая функция во время изминения состояния слайдера.
     * @example {() => console.log('Hello, SliderField')}
     */
    onChange: (value: any) => void,

    /**
     * Вызваемая функция после наведения вне поля слайдера.
     * @example {() => console.log('You are out of SliderField')}
     */
    onAfterChange: (value: any) => void,

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
// TODO Может пригодится, писал Вова
// const normalizeValue = value => _toInteger(String(value).replace(/[0-9]g/, '')) || 0;

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
        countFormat: props.countFormat,
        defaultValue: props.defaultValue,
        tooltipIsVisible: props.tooltipIsVisible,
        // TODO Может пригодится, писал Вова
        // onChange: range => props.input.onChange.call(null, range),
        // onAfterChange: value => {
        //     value = normalizeValue(value);
        //     props.input.onChange.call(null, value);
        // },
    }), [
        props.min,
        props.max,
        props.step,
        props.marks,
        props.isRange,
        props.onChange,
        props.disabled,
        props.isVertical,
        props.input.value,
        props.countFormat,
        props.defaultValue,
        props.onAfterChange,
        props.tooltipIsVisible,
    ]);

    return components.ui.renderView('form.SliderFieldView', {
        ...props,
        slider,
    });
}

SliderField.defaultProps = {
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
