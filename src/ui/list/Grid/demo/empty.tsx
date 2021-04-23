import Grid from '@steroidsjs/core/ui/list/Grid';
import * as React from 'react';
import {columns} from '@steroidsjs/core/ui/list/Grid/demo/basic';

/**
 * Grid with empty data
 * @order 2
 * @col 4
 */
export default () => (
    <>
        <Grid
            listId='GridEmptyDemo'
            items={[]}
            columns={columns}
            empty='Empty data'
        />
    </>
);
