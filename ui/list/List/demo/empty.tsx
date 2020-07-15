import * as React from 'react';

import List from '../List';

/**
 * Empty view with custom text when no items
 * @order 3
 * @col 4
 */
export default () => (
    <List
        listId='ListDemoPaginationEmpty'
        items={[]}
        empty='Empty data'
    />
);