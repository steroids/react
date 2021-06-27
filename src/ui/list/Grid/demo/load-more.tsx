import * as React from 'react';

import Grid from '../Grid';
import {columns, items} from './basic';

/**
 * Grid with load more
 * @order 4
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='GridLoadMoreDemo'
            items={items}
            columns={columns}
            pagination={{
                loadMore: true,
            }}
            paginationSize={{
                defaultValue: 2,
                sizes: [2, 3, 4],
            }}
        />
    </>
);
