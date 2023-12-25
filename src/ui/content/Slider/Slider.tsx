/* eslint-disable import/no-extraneous-dependencies */
import React, {useMemo} from 'react';
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

export default function Slider(props: ISliderProps) {
    const components = useComponents();

    const viewProps = useMemo(() => ({
        sliderOptions: props.sliderOptions,
        extensions: props.extensions,
        hasTrack: props.hasTrack,
        itemView: props.itemView,
        items: props.items,
        tag: props.tag,
        title: props.title,
        transition: props.transition,
        className: props.className,
        style: props.style,
    }), [props.sliderOptions, props.extensions, props.hasTrack, props.itemView, props.items,
        props.tag, props.title, props.transition, props.className, props.style]);

    return components.ui.renderView(props.view || 'content.SliderView', viewProps);
}
