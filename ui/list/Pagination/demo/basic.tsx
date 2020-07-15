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
            page={2}
            pageSize={10}
            total={100}
        />
        <div className='row'>
            <div className='col'>
                <h6>
                    Load more
                </h6>
                <Pagination
                    aroundCount={3}
                    page={2}
                    pageSize={20}
                    total={100}
                    loadMore
                />
            </div>
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
        </div>
    </>
);