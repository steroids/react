import * as React from 'react';

import Grid from '../Grid';
import {columns, items} from './basic';

/**
 * Grid with invisible column (column Work - visible: false)
 * @order 10
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='GridVisibleDemo'
            items={items}
            columns={columns.map(column => ({
                ...column,
                visible: column.attribute !== 'work',
            }))}
            paginationSize={{
                enable: true,
                defaultValue: 30,
            }}
        />
    </>
);
