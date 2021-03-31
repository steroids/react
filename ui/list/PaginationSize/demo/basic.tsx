import * as React from 'react';

import PaginationSize from '../PaginationSize';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        <div className='row'>
            {Object.keys(sizes).map(size => (
                <div className='col' key={size}>
                    <h6>
                        {sizes[size]}
                    </h6>
                    <PaginationSize
                        list={{
                            page: 2,
                            pageSize: 20,
                            total: 100,
                        }}
                        size={size}
                    />
                </div>
            ))}
        </div>
    </>
);
