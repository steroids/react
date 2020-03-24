import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * Pagination with search form
 * @order 6
 * @col 6
 */
export default class extends React.PureComponent {
    render() {
        return (
            <List
                listId='ListDemoPaginationSearch'
                items={demoItems.slice(0, 3)}
                searchForm={{
                    layout: 'horizontal',
                    fields: [
                        {
                            attribute: 'title',
                            label: 'Название',
                        },
                        {
                            attribute: 'category',
                            label: 'Категория',
                            component: 'DropDownField',
                        }
                    ]
                }}
                className='list-group'
                itemProps={{
                    className: 'list-group-item',
                }}
            />
        );
    }
}