import * as React from 'react';

import Grid from '../Grid';
import {items, columns} from './basic';

/**
 * Grid with controls
 * @order 9
 * @col 8
 */
export default () => (
    <>
        <Grid
            listId='GridControlsDemo'
            items={items}
            columns={columns}
            controls={[{
                id: 'delete',
                onClick: (e) => {
                    e.preventDefault();
                    alert("It's deleted");
                },
            }]}
        />
    </>
);
