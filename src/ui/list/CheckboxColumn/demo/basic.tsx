import Grid from '../../Grid';
import * as React from 'react';
import CheckboxColumn from '../CheckboxColumn';
import {columns, items} from '../../Grid/demo/basic';

/**
 * Basic
 * @order 1
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='CheckboxColumnBasicDemo'
            items={items}
            columns={[{
                valueView: CheckboxColumn,
                headerView: CheckboxColumn,
            }, ...columns]}
        />
    </>
);
