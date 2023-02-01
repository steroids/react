import * as React from 'react';
import Grid from '../Grid';
import {columns, items} from './basic';
import {searchForm} from './inner-search-form';

/**
 * Grid with search form
 * @order 6
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='GridSearchFormDemo'
            items={items}
            columns={columns}
            searchForm={{
                ...searchForm,
                layout: 'default',
            }}
        />
    </>
);
