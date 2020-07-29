import * as React from 'react';

import PasswordField from '../PasswordField';

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
    <div className='row'>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <PasswordField label={size} size={size}/>
            </div>
        ))}
    </div>
);