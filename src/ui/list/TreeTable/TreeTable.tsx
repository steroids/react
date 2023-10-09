import * as React from 'react';
import {useMemo} from 'react';
import _merge from 'lodash-es/merge';

import {IColumnViewProps, IGridColumn, IGridProps} from '../Grid/Grid';
import Grid from '../Grid';

export interface ITreeColumnViewProps extends IColumnViewProps {
    item: {
        onTreeItemClick?: (uniqueId: string, item: {[key: string]: any}) => void;

        [key: string]: any
    },
}

export interface ITreeTableItem {
    /**
     * Идентификатор узла
     */
    id?: string | number,

    /**
     * Вложенные элементы
     * @example items: [{id: 3, name: 'Ivan'}]
     */
    items?: any[],

    /**
     * Уникальный идентификатор,
     * используется для сохранения состояния открыта или закрыта ячейка
     */
    uniqueId?: string,
}

export interface ITreeTableProps extends Omit<IGridProps, 'items'> {
    /**
     * Элементы коллекции
     * @example [{id: 1, name: 'Jane'}, {id: 2, name: 'John', items: [...]}]
     */
    items?: ITreeTableItem[]
}

const TREE_COLUMN_VIEW_FIELDS = {
    valueView: 'TreeColumnView',
    headerClassName: 'TreeColumnHeader',
};

export const addTreeColumnFieldsToFirstColumn = (columns: IGridColumn[]) => {
    const newColumns = [...columns];

    // Add tree view to the first column
    _merge(newColumns[0], TREE_COLUMN_VIEW_FIELDS);

    return newColumns;
};

export default function TreeTable(props: ITreeTableProps): JSX.Element {
    const columns = useMemo(
        () => addTreeColumnFieldsToFirstColumn(props.columns),
        [props.columns],
    );

    return (
        <Grid
            {...props}
            columns={columns}
            items={props.items}
            itemsIndexing={false}
            hasTreeItems
        />
    );
}
