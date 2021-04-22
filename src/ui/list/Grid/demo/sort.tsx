import * as React from 'react';

import Grid from '../Grid';
import {items} from '../../List/demo/sort';

/**
 * Grid with sorting
 * @order 7
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='GridSortDemo'
            items={items}
            columns={[
                {
                    attribute: 'title',
                    label: 'Title',
                },
                {
                    attribute: 'price',
                    label: 'Price',
                    sortable: true,
                },
            ]}
        />
    </>
);
