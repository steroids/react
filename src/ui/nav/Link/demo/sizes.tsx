import * as React from 'react';

import Link from '../Link';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 5
 * @col 8
 */
export default () => (
    <>
        {Object.keys(sizes).map(size => (
            <Link
                key={size}
                size={size}
                className='float-left mr-2'
                url='https://google.ru'
                target='_blank'
                label={sizes[size]}
            />
        ))}
    </>
);
