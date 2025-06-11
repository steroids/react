import {useMemo} from 'react';
import * as React from 'react';
import _merge from 'lodash-es/merge';
import Grid from '../../../../src/ui/list/Grid';
import {ITreeTableProps} from '../../../../src/ui/list/TreeTable/TreeTable';
import useTree from '../../../../src/hooks/useTree';
import useSelector from '../../../../src/hooks/useSelector';
import {getList} from '../../../../src/reducers/list';
import TreeColumnView from './TreeColumnMockView';

export default function TreeTableMock(props: ITreeTableProps): JSX.Element {
    // Add tree view to the first column
    const columns = useMemo(() => {
        const newColumns = [...props.columns];

        const additionalFields = {
            valueView: TreeColumnView,
            headerClassName: 'TreeColumnHeader',
        };

        _merge(newColumns[0], {
            ...additionalFields,
            levelPadding: props.levelPadding,
        });

        return newColumns;
    }, [props.columns, props.levelPadding]);

    const list = useSelector(state => getList(state, props.listId));

    const {treeItems} = useTree({
        items: props.items,
        autoOpenLevels: 0,
        alwaysOpened: props.alwaysOpened,
        currentPage: list?.page,
        itemsOnPage: list?.pageSize,
        saveInClientStorage: props.saveInClientStorage,
    });

    return (
        <Grid
            {...props}
            columns={columns}
            items={treeItems}
            itemsIndexing={false}
        />
    );
}

TreeTableMock.defaultProps = {
    levelPadding: 32,
    saveInClientStorage: false,
};
