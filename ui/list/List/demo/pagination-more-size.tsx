import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * Pagination with load more and show sizes switcher
 * @order 4
 * @col 6
 */
export default () => (
    <List
        listId='ListDemoPaginationMore'
        items={demoItems}
        pagination={{
            loadMore: true,
        }}
        paginationSize={{
            enable: true,
            sizes: [3, 6, 9],
            defaultValue: 3,
        }}
        className='list-group'
        itemProps={{
            className: 'list-group-item',
        }}
    />
);