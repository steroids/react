import * as React from 'react';

import InputField from '../InputField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 10
 * @col 12
 */
export default () => (
    <div className='row'>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <InputField label={size} size={size} />
            </div>
        ))}
    </div>
);
