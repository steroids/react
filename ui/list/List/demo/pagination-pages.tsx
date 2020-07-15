import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * Pagination with page numbers and custom position (show both: top and bottom)
 * @order 2
 * @col 4
 */
export default () => (
    <List
        listId='ListDemoPaginationPages'
        items={demoItems}
        pagination={{
            loadMore: false,
            position: 'both'
        }}
        paginationSize={{
            defaultValue: 3,
            sizes: [2, 3, 4],
        }}
        className='list-group'
        itemProps={{
            className: 'list-group-item',
        }}
    />
);