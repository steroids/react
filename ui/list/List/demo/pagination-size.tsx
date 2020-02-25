import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * Pagination size
 * @order 4
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <List
                listId='ListDemoPaginationMore'
                items={demoItems}
                paginationSizeView={true}
                paginationSizeProps={{
                    sizes: [10, 50, 100],
                }}
                className='list-group'
                itemProps={{
                    className: 'list-group-item',
                }}
            />
        );
    }
}