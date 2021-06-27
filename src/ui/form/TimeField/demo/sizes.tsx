import * as React from 'react';
import TimeField from '../TimeField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 5
 * @col 12
 */
export default () => (
    <>
        <div className='row'>
            {Object.keys(sizes).map(size => (
                <div className='col' key={size}>
                    <TimeField label={sizes[size]} size={size} />
                </div>
            ))}
        </div>
    </>
);
