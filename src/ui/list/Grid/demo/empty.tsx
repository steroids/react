import * as React from 'react';
import Grid from '../Grid';
import {columns} from './basic';

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
