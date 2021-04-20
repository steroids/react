import * as React from 'react';

import Pagination from '../Pagination';

export default () => (
    <>
        <Pagination
            //Pagination.defaultProps not working
            aroundCount={5}
            list={{
                total: 100,
                page: 2,
                pageSize: 10,
            }}
        />
    </>
);
