import {ReactNode, useMemo} from 'react';

/**
 * DetailItem
 * Элемент "ключ-значение" в таблице Detail
 */
export interface IDetailItemProps {
    /**
     * Наименование
     * @example 'Product'
     */
    label: string | number | ReactNode,

    /**
     * Значение
     * @example 'Cloud Database'
     */
    children: ReactNode,

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

const defaultProps: Partial<IDetailItemProps> = {
    span: 1,
};

export default function DetailItem(receivedProps: IDetailItemProps): JSX.Element {
    const props = useMemo(() => ({
        ...defaultProps,
        ...receivedProps,
    }), [receivedProps]);

    return props.children as JSX.Element;
}

DetailItem.displayName = 'DetailItem';
