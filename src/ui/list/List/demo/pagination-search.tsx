import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';
import {items as dropDownFieldItems} from '../../../form/DropDownField/demo/basic';

/**
 * Pagination with search form, address bar and custom pagination
 * @order 6
 * @col 6
 */
export default () => (
    <List
        listId='ListDemoPaginationSearch'
        items={demoItems}
        searchForm={{
            layout: 'horizontal',
            fields: [
                'title',
                'category',
            ],
            model: {
                attributes: [
                    'title:string:Название',
                    {
                        attribute: 'category',
                        label: 'Категория',
                        searchField: 'DropDownField',
                        searchFieldProps: {
                            items: dropDownFieldItems,
                        },
                    },
                ],
            }
        }}
        paginationSize={{
            attribute: 'ps',
            sizes: [2, 4],
        }}
        addressBar
        className='list-group'
        itemProps={{
            className: 'list-group-item',
        }}
    />
);
