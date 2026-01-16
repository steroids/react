import * as React from 'react';

import {useComponents} from '../../../hooks';

/**
 * BooleanFormatter
 *
 * Компонент BooleanFormatter предназначен для форматирования значения типа boolean, string или number.
 * Он позволяет кастомизировать отображение значения, используя переданный view React компонент.
 **/
export interface IBooleanFormatterProps {
    /**
    * Значение для BooleanFormatter
    */
    value?: string | number | boolean,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView,

    [key: string]: any,
}

export interface IBooleanFormatterPropsView {
    value?: string | number | boolean,
    children?: React.ReactNode,
}

export default function BooleanFormatter(props: IBooleanFormatterProps): JSX.Element {
    return useComponents().ui.renderView(props.view || 'format.BooleanFormatterView', {
        value: props.value,
    });
}
