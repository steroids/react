import * as React from 'react';
import List from '../../List';
import {searchForm, items} from '../../List/demo/search-form';

/**
 * List with search form
 * @order 1
 * @col 6
 */
export default () => (
    <List
        listId='ListDemoSearch'
        items={items}
        searchForm={searchForm}
        className='list-group'
        // @ts-ignore
        itemView={(props: any) => (
            <div className='list-group-item'>
                <div>{props.item.name}</div>
                <div>{`Category: ${props.item.category}`}</div>
            </div>
        )}
    />
);
