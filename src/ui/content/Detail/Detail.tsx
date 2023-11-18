import React, {useRef, useMemo, useState, useEffect} from 'react';
import _isArray from 'lodash/isArray';
import _orderBy from 'lodash/orderBy';
import {useComponents} from '../../../hooks';
import DetailItem, {IDetailItemProps} from './DetailItem';
import {IControlItem} from '../../nav/Controls/Controls';

/**
 * Detail
 * Представление данных в виде таблицы, в которой поля группируются по принципу "ключ-значение".
 */
export enum DetailLayoutEnum {
    Horizontal = 'horizontal',
    Vertical = 'vertical'
}

export interface IDetailMedia {
    /**
     * Максимальная ширина таблицы в px
     * @example 600
     */
    breakpoint: number,

    /**
     * Количество колонок, которое будет применяться, начиная от указанной ширины и меньше
     * @example 2
     */
    column: number
}

export interface IDetailResponsive {
    /**
     * Перестраивать таблицу при ресайзе
     */
    enable?: boolean,

    /**
     * Брейкпоинты
     */
    media: IDetailMedia[]
}

/**
 * Detail
 *
 * Представление данных в виде таблицы, в которой поля группируются по принципу "ключ-значение".
 *
 * Компонент `Detail` принимает данные в виде дочерних компонентов `DetailItem`, которые отображаются
 * в виде таблицы с ячейками "ключ-значение".
 *
 * Компонент поддерживает различные настройки, такие как размер ячеек, вариант расположения
 * ячеек ("horizontal" или "vertical"), а также респонсивный режим, позволяющий перестраивать
 * таблицу при изменении размеров окна.
 *
 * Компонент также может отображать заголовок таблицы и контролы, расположенные рядом с таблицей.
 */
export interface IDetailProps extends IUiComponent {
    /**
     * Размер ячеек в таблице
     * @example 'sm'
     */
    size?: Size,

    /**
     * Вариант расположения ячеек "ключ-значение"
     * @example 'horizontal'
     */
    layout?: DetailLayoutEnum

    /**
     * Перестраивать таблицу при ресайзе
     * @example
     * {
     *  enable: true,
     *  media: [
     *   {
     *    breakpoint: 600,
     *    column: 2
     *   }
     *  ]
     * }
     */
    responsive?: boolean | IDetailResponsive,

    /**
     * Максимальное количество колонок
     * @example 3
     */
    column?: number

    /**
     * Заголовок таблицы
     * @example 'User info'
     */
    title?: string | React.ReactNode

    /**
     * Контролы, которые нужно расположить рядом с таблицей
     * @example
     * [{
     *  label: __(('Edit')),
     *  onClick: () => props.onClick()
     * }]
     */
    controls?: IControlItem[],

    /**
     * Дочерние компоненты
     */
    children?: React.ReactNode | React.ReactNode[],

    [key: string]: any
}

export interface IDetailItemOutputProps extends IDetailItemProps {
    colspan: number,
    value: IDetailItemProps['children']
}

export interface IDetailViewProps extends IDetailProps {
    rows: IDetailItemOutputProps[][],
    resizedNodeRef?: (node: HTMLDivElement) => void
}

export const constants = Object.freeze({
    MAX_COLUMN: 3,
    CELLS_IN_COLUMN: 2,
    TABLE_HEAD_COLSPAN: 1,
});

const getDetailItems = (children: React.ReactNode | React.ReactNode[]): any[] => (
    React.Children.toArray(children)
        .filter((child: any) => child?.type?.displayName === DetailItem.displayName)
);

const normalizeSpan = (span: number, column: number): number => (span > column)
    ? column
    : (span || 1);

const createRows = (detailItems: any[], column: number, layout: DetailLayoutEnum): IDetailItemOutputProps[][] => {
    const result = [];

    let freeColumns = column;
    let rowIndex = 0;
    result[rowIndex] = [];

    detailItems.forEach((detailItem, index) => {
        if (!freeColumns) {
            freeColumns = column;
            rowIndex += 1;
            result[rowIndex] = [];
        }

        const isLastDetailItem = index === (detailItems.length - 1);

        let span = normalizeSpan(detailItem.props.span, column);
        let nextSpan = null;
        if (!isLastDetailItem) {
            nextSpan = normalizeSpan(detailItems[index + 1].props.span, column);
        }

        freeColumns -= span;
        if (isLastDetailItem || nextSpan > freeColumns) {
            span += freeColumns;
            freeColumns = 0;
        }

        result[rowIndex].push({
            ...detailItem.props,
            colspan: layout === DetailLayoutEnum.Horizontal
                ? span * constants.CELLS_IN_COLUMN - constants.TABLE_HEAD_COLSPAN
                : span,
            value: detailItem,
        });
    });

    return result;
};

const normalizeResponsiveProps = (props: IDetailProps['responsive']): IDetailResponsive => (typeof props === 'boolean'
    ? {
        enable: props,
        media: [
            {
                breakpoint: 500,
                column: 1,
            },
            {
                breakpoint: 700,
                column: 2,
            },
            {
                breakpoint: 1000,
                column: 3,
            },
        ],
    }
    : {
        enable: true,
        ...props,
        media: _orderBy(props.media, ['breakpoint'], ['asc']),
    }
);

export default function Detail(props: IDetailProps): JSX.Element {
    const components = useComponents();
    const detailItems = useMemo(() => getDetailItems(props.children), [props.children]);
    const responsiveProps = useMemo(() => normalizeResponsiveProps(props.responsive), [props.responsive]);

    const [column, setColumn] = useState(props.column || constants.MAX_COLUMN);
    const [rows, setRows] = useState(createRows(detailItems, column, props.layout));

    // Add responsive option
    const resizeObserver = useRef(new ResizeObserver((entries:ResizeObserverEntry[]) => {
        entries.forEach(entry => {
            if (!entry.borderBoxSize) {
                return;
            }

            const {inlineSize} = (_isArray(entry.borderBoxSize)
                ? entry.borderBoxSize[0]
                : entry.borderBoxSize) as ResizeObserverSize;

            // eslint-disable-next-line no-restricted-syntax
            for (const mediaItem of responsiveProps.media) {
                if (inlineSize < mediaItem.breakpoint) {
                    setColumn(mediaItem.column);
                    return;
                }
            }

            setColumn(props.column || constants.MAX_COLUMN);
        });
    }));
    const resizedNodeRef = React.useCallback((node: HTMLDivElement) => {
        if (!resizeObserver.current) {
            return;
        }

        if (node !== null) {
            resizeObserver.current.observe(node);
            return;
        }

        resizeObserver.current.disconnect();
    }, [resizeObserver]);

    useEffect(() => {
        setRows(createRows(detailItems, column, props.layout));
    }, [column, detailItems, props.layout]);

    return components.ui.renderView(props.view || 'content.DetailView', {
        ...props,
        rows,
        ...(responsiveProps.enable ? {resizedNodeRef} : {}),
    });
}

Detail.defaultProps = {
    size: 'sm',
    layout: DetailLayoutEnum.Horizontal,
    column: constants.MAX_COLUMN,
    responsive: true,
};
