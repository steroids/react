import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * Pagination with page numbers
 * @order 2
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <List
                listId='ListDemoPaginationPages'
                items={demoItems.slice(0, 3)}
                defaultPageSize={3}
                total={demoItems.length}
                loadMore={false}
                className='list-group'
                itemProps={{
                    className: 'list-group-item',
                }}
            />
        );
    }
}