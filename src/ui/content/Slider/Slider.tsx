/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {Options, SplideProps} from '@splidejs/react-splide';
import {AutoScroll} from '@splidejs/splide-extension-auto-scroll';
import {Intersection} from '@splidejs/splide-extension-intersection';
import {Video} from '@splidejs/splide-extension-video';
import {Grid} from '@splidejs/splide-extension-grid';
import {useComponents} from '../../../hooks';

export const SLIDER_EXTENSIONS = {
    AutoScroll,
    Intersection,
    Video,
    Grid,
};

type SliderExtensionsType = typeof SLIDER_EXTENSIONS;

/**
 * Пропсы для компонента Slider.
 */
export interface ISliderProps extends IUiComponent, Omit<SplideProps, 'extensions' | 'items'> {
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
     * Дополнительные расширения Splide.
     */
    extensions?: {
        /**
         * Флаг наличия автоматической прокрутки.
         */
        hasAutoScroll?: boolean;

        /**
         * Флаг наличия обнаружения пересечений.
         */
        hasIntersection?: boolean;

        /**
         * Флаг наличия видео.
         */
        hasVideo?: boolean;

        /**
         * Флаг наличия сетки.
         */
        hasGrid?: boolean;
    };

    /**
     * Дополнительные свойства.
     */
    [key: string]: any;
}

export interface ISliderViewProps extends Omit<ISliderProps, 'extensions'> {
    extensions?: Partial<SliderExtensionsType>,
}

export default function Slider(props: ISliderProps) {
    const components = useComponents();

    const extensions = React.useMemo(() => {
        const extensionsObject: Record<string, any> = {};

        if (props.extensions?.hasAutoScroll) {
            extensionsObject.AutoScroll = SLIDER_EXTENSIONS.AutoScroll;
        }

        if (props.extensions?.hasIntersection) {
            extensionsObject.Intersection = SLIDER_EXTENSIONS.Intersection;
        }

        if (props.extensions?.hasVideo) {
            extensionsObject.Video = SLIDER_EXTENSIONS.Video;
        }

        if (props.extensions?.hasGrid) {
            extensionsObject.Grid = SLIDER_EXTENSIONS.Grid;
        }

        return extensionsObject;
    }, [props.extensions?.hasAutoScroll, props.extensions?.hasGrid, props.extensions?.hasIntersection, props.extensions?.hasVideo]);

    return components.ui.renderView(props.view || 'content.SliderView', {
        ...props,
        extensions,
    });
}
