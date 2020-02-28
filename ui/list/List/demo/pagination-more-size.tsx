import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * Pagination with load more and show sizes switcher
 * @order 3
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <List
                listId='ListDemoPaginationMore'
                items={demoItems.slice(0, 3)}
                total={demoItems.length}
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
    }
}