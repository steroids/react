import * as React from 'react';

import PaginationSize from '../PaginationSize';
// import {demoItems} from '../../../../ui/list/List/demo/basic';

/**
 * Basic
 * @order 1
 * @col 3
 */
export default () => (
    <>
        <PaginationSize
            list={{
                pageSize: 3,
                // items: demoItems,
            }}
            enable
            attribute='pageSize'
            sizes={[3, 6, 9]}
            defaultValue={3}
            position='top'
        />
    </>
);
