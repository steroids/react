import * as React from 'react';

import Grid from '../Grid';
import {items, columns} from './basic';

/**
 * Grid with page numbers
 * @order 3
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='GridPaginationDemo'
            items={items}
            columns={columns}
            paginationSize={{
                defaultValue: 2,
                sizes: [2, 3, 4],
            }}
            pagination
        />
    </>
);
