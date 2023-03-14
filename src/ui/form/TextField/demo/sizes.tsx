import * as React from 'react';
import TextField from '../TextField';

/**
 * По-умлочанию TextField имеет 3 заданных размера.
 * @order 7
 * @col 12
 */

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        <div className='row'>
            {Object.keys(sizes).map(size => (
                <div
                    className='col'
                    key={size}
                >
                    <TextField
                        label={sizes[size]}
                        size={size}
                    />
                </div>
            ))}
        </div>
    </>
);
