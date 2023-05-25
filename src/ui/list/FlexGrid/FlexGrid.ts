import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import {useComponents} from '../../../hooks';

export interface IAdaptiveGaps {
    /**
     * Расстояние между элементами на экранах размером lg
     * Если передано число, то установится расстояние между строками и между колонками.
     * Если передан массив, то первый элемент - расстояние между колонками, второй - между строками.
     */
    lg?: number | number[],

    /**
     * Расстояние между элементами на экранах размером md
     * Если передано число, то установится расстояние между строками и между колонками.
     * Если передан массив, то первый элемент - расстояние между колонками, второй - между строками.
     */
    md?: number | number[],

    /**
     * Расстояние между элементами на экранах размером sm
     * Если передано число, то установится расстояние между строками и между колонками.
     * Если передан массив, то первый элемент - расстояние между колонками, второй - между строками.
     */
    sm?: number | number[],
}

export interface IFlexGridItem {
    /**
     * Содержимое элемента FlexGrid
     */
    content: CustomView,

    /**
     * Порядок элемента в FlexGrid
     */
    order?: number,

    /**
     * Количество ячеек для смещения столбца слева
     */
    offset?: number,

    /**
     * Количество колонок, которое занимает элемент, максимум 12
     */
    col?: number,

    /**
     * Количество колонок, которое занимает элемент на экранах размером lg
     */
    lg?: number,

    /**
     * Количество колонок, которое занимает элемент на экранах размером md
     */
    md?: number,

    /**
     * Количество колонок, которое занимает элемент на экранах размером sm
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
     * @example [{label: 'Name', attribute: 'name'}, {label: 'Work', attribute: 'work'}]
     */
    items?: IFlexGridItem[];

    /**
     * Вложенные элементы
     */
    children?: React.ReactNode,

    /**
     * Расстояние между элементами в px.
     * Если передано число, то установится расстояние между строками и между колонками.
     * Если передан массив, то первый элемент - расстояние между колонками, второй - между строками.
     */
    gap?: number | number[] | IAdaptiveGaps,

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
    justify?: string,

    /**
     * Значение для css-свойства align-items
     */
    align?: string,

    [key: string]: any;
}

interface IGaps {
    colGap?: number,
    rowGap?: number,
}

export interface IFlexGridViewProps extends IFlexGridProps, IGaps {
    lg?: IGaps,
    md?: IGaps,
    sm?: IGaps,
}

const getGapsFromArray = (gap: number[]) => ({
    colGap: gap[0],
    rowGap: gap[1],
});

const getGapsFromNumber = (gap: number) => ({
    colGap: gap,
    rowGap: gap,
});

const normalizeGap = (gap: number | number[] | IAdaptiveGaps) => {
    if (_isArray(gap)) {
        return getGapsFromArray(gap as number[]);
    }

    if (_isObject(gap)) {
        Object.entries(gap || {}).forEach(([screenSize, gapValue]) => {
            if (_isArray(gapValue)) {
                gap[screenSize] = getGapsFromArray(gapValue);
            } else {
                gap[screenSize] = getGapsFromNumber(gapValue);
            }
        });

        return gap as object;
    }

    return getGapsFromNumber(gap as number);
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
