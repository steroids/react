import * as React from 'react';

import Grid from '../Grid';
import {items, columns} from './basic';

/**
 * Grid with indexing items
 * @order 8
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='GridIndexingDemo'
            items={items.map((item, index) => ({...item, index}))}
            columns={columns}
            itemsIndexing
            paginationSize={{
                defaultValue: 2,
                sizes: [2, 3, 4],
            }}
            pagination
        />
    </>
);
