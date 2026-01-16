/* eslint-disable import/no-extraneous-dependencies */
import {forwardRef} from 'react';
import {Options, SplideProps} from '@splidejs/react-splide';
import {useComponents} from '../../../hooks';

/**
 * Slider
 *
 * Компонент слайдера позволяет создавать слайдшоу, где элементы могут быть пролистаны
 * с помощью прокрутки или перетаскивания.
 **/
export interface ISliderProps extends IUiComponent, Omit<SplideProps, 'items'> {
    /**
     * Опции слайдера.
     */
    sliderOptions: Options,

    /**
     * Элементы слайдера.
     */
    items: Record<string, any>[],

    /**
     * Представление элемента слайдера.
     */
    itemView: CustomView | any,

    /**
     * Дополнительные свойства.
     */
    [key: string]: any,
}

export type ISliderViewProps = ISliderProps

function Slider(props: ISliderProps, ref) {
    const components = useComponents();

    return components.ui.renderView(props.view || 'content.SliderView', {
        ...props,
        ref,
    });
}

export default forwardRef(Slider);
