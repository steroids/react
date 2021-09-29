import * as React from 'react';
import { useComponents } from '@steroidsjs/core/hooks';

interface ICollapseItemProps {
    view?: any,
    style?: React.CSSProperties,
    children?: any,

    /**
     * Дополнительный CSS-класс
     */
    className?: CssClassName;

    /**
     * Название CollapseItem
     * @example {'Подробнее'}
     */
    title?: string,

    /**
     * @example {true}
     */
    disabled?: boolean,

    /**
     * Кастомная иконка svg или название иконки
     * @example {'circle'}
     */
    icon?: React.ReactNode | string,

    /**
     * Показ иконки, которая показывает состояние CollapseItem. Поумолчанию включены.
     * @example {false}
     */
    showIcon?: boolean,

    /**
     * Позиция иконки-индикатора
     * @example {'left'}
     */
    iconPosition?: 'left' | 'right',

    /**
     * Включает режим Аккордиона (только один CollapseItem может быть открыт)
     * @example {true}
     */
    isAccordion?: boolean,

    /**
     * Номер активного CollapseItem, который может меняться динамический или быть статичным
     * @example
     */
    activeKey?: number,

    /**
     * Вызываемая функция при каждом изменении состояния
     * @example {() => {console.log('success')}}
     */
    onChange?: () => void,

    /**
     * Отключение внешних рамок
     * @example {true}
     */
    borderless?: boolean,
}

export interface ICollapseItemViewProps extends ICollapseItemProps {
    toggleCollapse?: (number) => void,
    toggleAccordion?: (number) => void,
    childIndex?: number,
    isShowMore?: boolean,
}

function CollapseItem(props: ICollapseItemProps) {
    const components = useComponents();
    return components.ui.renderView(props.view || 'content.CollapseItemView', {
        ...props,
    });
}

CollapseItem.defaultProps = {
    title: 'Collapse',
};

export default CollapseItem;
