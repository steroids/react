import * as React from 'react';

import Pagination from '../Pagination';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <h6>
                    {sizes[size]}
                </h6>
                <Pagination
                    aroundCount={3}
                    page={2}
                    pageSize={20}
                    total={100}
                    size={size}
                />
            </div>
        ))}
    </>
);
