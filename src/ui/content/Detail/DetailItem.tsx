import React from 'react';

/**
 * DetailItem
 * Элемент "ключ-значение" в таблице Detail
 */
export interface IDetailItemProps {
    /**
     * Наименование
     * @example 'Product'
     */
    label: string | number | React.ReactNode,

    /**
     * Значение
     * @example 'Cloud Database'
     */
    children: React.ReactNode,

    /**
     * Количество колонок, которое занимает элемент
     * @example 3
     */
    span?: number,

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
    */
    view?: CustomView,

    /**
     * Дополнительный CSS-класс для ячейки с наименованием
     */
    labelClassName?: string,

    /**
     * Дополнительный CSS-класс для ячейки со значением
     */
    contentClassName?: string,
}

export default function DetailItem(props: IDetailItemProps): JSX.Element {
    return props.children as JSX.Element;
}

DetailItem.defaultProps = {
    span: 1,
};

DetailItem.displayName = 'DetailItem';
