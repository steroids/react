import * as React from 'react';
import DateField from '../DateField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 7
 * @col 12
 */
export default () => (
    <>
        <div className='row mb-4'>
            {Object.keys(sizes).map(size => (
                <div className='col' key={size}>
                    <DateField label={size} size={size} />
                </div>
            ))}
        </div>
    </>
);
