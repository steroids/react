import Grid from '@steroidsjs/core/ui/list/Grid';
import {columns, items} from '@steroidsjs/core/ui/list/Grid/demo/basic';
import * as React from 'react';
import {searchForm} from '@steroidsjs/core/ui/list/Grid/demo/inner-search-form';

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
