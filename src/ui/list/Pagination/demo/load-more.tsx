import * as React from 'react';

import Pagination from '../Pagination';

export default () => (
    <>
        <h6>
            Load more
        </h6>
        <Pagination
            aroundCount={3}
            list={{
                total: 100,
                page: 2,
                pageSize: 20
            }}
            loadMore
        />
    </>
);
