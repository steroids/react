import * as React from 'react';

import Button from '../Button';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 10
 * @col 8
 */
export default () => (
    <>
        {Object.keys(sizes).map(size => (
            <Button
                key={size}
                size={size}
                className='float-left mr-2'
            >
                {sizes[size]}
            </Button>
        ))}
    </>
);
