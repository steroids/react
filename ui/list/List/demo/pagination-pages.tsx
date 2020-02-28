import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * Pagination with page numbers and custom position (show both: top and bottom)
 * @order 2
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <List
                listId='ListDemoPaginationPages'
                items={demoItems.slice(0, 3)}
                total={demoItems.length}
                pagination={{
                    loadMore: false,
                    position: 'both'
                }}
                paginationSize={{
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