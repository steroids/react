import * as React from 'react';
import InputField from '../InputField';

/**
 * По-умлочанию InputField имеет 3 заданных размера поля.
 * @order 9
 * @col 12
 */

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <div className='row'>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <InputField label={size} size={size} />
            </div>
        ))}
    </div>
);
