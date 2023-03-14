import * as React from 'react';

import NumberField from '../NumberField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * По-умлочанию NumberField имеет 3 заданных размера поля.
 * @order 5
 * @col 12
 */

export default () => (
    <div className='row'>
        {Object.keys(sizes).map(size => (
            <div
                className='col'
                key={size}
            >
                <NumberField
                    label={size}
                    size={size}
                />
            </div>
        ))}
    </div>
);
