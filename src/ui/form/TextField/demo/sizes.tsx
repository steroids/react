import * as React from 'react';
import TextField from '../TextField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 6
 * @col 12
 */
export default () => (
    <>
        <div className='row'>
            {Object.keys(sizes).map(size => (
                <div className='col' key={size}>
                    <TextField label={sizes[size]} size={size} />
                </div>
            ))}
        </div>
    </>
);
