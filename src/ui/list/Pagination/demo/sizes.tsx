import * as React from 'react';

import Pagination from '../Pagination';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 3
 * @col 12
 */
export default () => (
    <>
        <div className='row'>
            {Object.keys(sizes).map(size => (
                <div
                    className='col'
                    key={size}
                >
                    <h6>
                        {sizes[size]}
                    </h6>
                    <Pagination
                        aroundCount={3}
                        list={{
                            total: 100,
                            page: 2,
                            pageSize: 20,
                        }}
                        size={size}
                    />
                </div>
            ))}
        </div>
    </>
);
