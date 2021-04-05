import * as React from 'react';

import Pagination from '../Pagination';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        <Pagination
            //Pagination.defaultProps not working
            aroundCount={5}
            list={{
                total: 100,
                page: 2,
                pageSize: 10
            }}
        />
        <div className='row'>
            <div className='col'>
                <h6>
                    Load more
                </h6>
                <Pagination
                    aroundCount={3}
                    loadMore
                    list={{
                        total: 100,
                        page: 2,
                        pageSize: 20
                    }}
                />
            </div>
            {Object.keys(sizes).map(size => (
                <div className='col' key={size}>
                    <h6>
                        {sizes[size]}
                    </h6>
                    <Pagination
                        aroundCount={3}
                        list={{
                            total: 100,
                            page: 2,
                            pageSize: 20
                        }}
                        size={size}
                    />
                </div>
            ))}
        </div>
    </>
);
