import _isArray from 'lodash-es/isArray';
import {useComponents} from '../../../hooks';

export interface IFlexGridItem {
    /**
     * Содержимое элемента FlexGrid
     */
    content: any,

    /**
     * Порядок элемента в FlexGrid
     */
    order?: number,

    /**
     * Количество колонок для смещения столбца слева
     */
    offset?: number,

    /**
     * Количество колонок, которое занимает элемент, максимум 12
     */
    col?: number,

    /**
     * Количество колонок, которое занимает элемент на экранах размером lg, максимум 12
     */
    lg?: number,

    /**
     * Количество колонок, которое занимает элемент на экранах размером md, максимум 12
     */
    md?: number,

    /**
     * Количество колонок, которое занимает элемент на экранах размером sm, максимум 12
     */
    sm?: number,
}

/**
 * FlexGrid
 * Flex контейнер для элементов и компонентов.
 */
export interface IFlexGridProps extends IUiComponent {
    /**
     * Элементы FlexGrid
     * @example
     * [
     *  {
     *   content: 'Block1',
     *   col: 4
     *  },
     *  {
     *   content: 'Block2',
     *   col: 6
     *  }
     * ]
     */
    items?: IFlexGridItem[],

    /**
     * Вложенные элементы
     */
    children?: React.ReactNode,

    /**
     * Дополнительный CSS-класс для элементов FlexGrid
     */
    itemClassName?: CssClassName,

    /**
     * Расстояние между элементами в px.
     * Если передано число, то установится расстояние между строками и между колонками.
     * Если передан массив, то первый элемент - расстояние между колонками, второй - между строками.
     */
    gap?: number | number[],

    /**
     * Значение для css-свойства flex-direction
     */
    direction?: 'column-reverse' | 'column' | 'row-reverse' | 'row',

    /**
     * Автоматический перенос на новую строку
     */
    wrap?: boolean,

    /**
     * Значение для css-свойства justify-content
     */
    justify?: 'center' | 'end' | 'start' | 'stretch' | 'flex-start' | 'flex-end'
        | 'left' | 'right' | 'space-between' | 'space-around' | 'space-evenly',

    /**
     * Значение для css-свойства align-items
     */
    align?: 'center' | 'end' | 'start' | 'stretch' | 'flex-start' | 'flex-end',

    [key: string]: any,
}

export interface IFlexGridViewProps extends IFlexGridProps {
    colGap?: number,
    rowGap?: number,
}

const normalizeGap = (gap: number | number[]) => {
    if (_isArray(gap)) {
        return {
            colGap: gap[0],
            rowGap: gap[1],
        };
    }

    return {
        colGap: gap,
        rowGap: gap,
    };
};

export default function FlexGrid(props: IFlexGridProps): JSX.Element {
    const components = useComponents();
    const {view, ...viewProps} = props;

    return components.ui.renderView(view || 'list.FlexGridView', {
        ...viewProps,
        ...normalizeGap(props.gap),
    });
}

FlexGrid.defaultProps = {
    wrap: false,
    gap: 24,
};
