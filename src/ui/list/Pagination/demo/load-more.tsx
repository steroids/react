import * as React from 'react';

import Pagination from '../Pagination';

/**
 * Load more
 * @order 2
 * @col 4
 */
export default () => (
    <>
        <Pagination
            aroundCount={3}
            list={{
                total: 100,
                page: 2,
                pageSize: 20,
            }}
            loadMore
        />
    </>
);
