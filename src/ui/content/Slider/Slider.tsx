/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {Options, SplideProps} from '@splidejs/react-splide';
import {useComponents} from '../../../hooks';

/**
 * Slider
 *
 * Компонент слайдера позволяет создавать слайдшоу, где элементы могут быть пролистаны
 * с помощью прокрутки или перетаскивания.
 *
 * Компонент `Slider` принимает следующие свойства:
 *
 * - `sliderOptions`: опции слайдера, используемые для настройки поведения слайдера. (тип: Options)
 * - `items`: элементы слайдера, представленные в виде массива записей. (тип: Record<string, any>[])
 * - `itemView`: представление элемента слайдера, используемое для кастомизации отображения каждого слайда. (тип: CustomView | any)
 * - дополнительные свойства: любые дополнительные свойства, которые могут быть переданы компоненту.
 *
 * Примечание: Компонент `Slider` требует указания опций слайдера (`sliderOptions`) и элементов слайдера (`items`).
 */
export interface ISliderProps extends IUiComponent, Omit<SplideProps, 'items'> {
    /**
     * Опции слайдера.
     */
    sliderOptions: Options;

    /**
     * Элементы слайдера.
     */
    items: Record<string, any>[];

    /**
     * Представление элемента слайдера.
     */
    itemView: CustomView | any;

    /**
     * Дополнительные свойства.
     */
    [key: string]: any;
}

export type ISliderViewProps = ISliderProps

export default function Slider(props: ISliderProps) {
    const components = useComponents();

    return components.ui.renderView(props.view || 'content.SliderView', {
        ...props,
    });
}
