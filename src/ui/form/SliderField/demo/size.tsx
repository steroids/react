import * as React from 'react';
import SliderField from '../SliderField';

/**
 * По-умлочанию SliderField имеет 3 заданных размера.
 * @order 6
 * @col 12
 */

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <div className='row' style={{padding: '0 10px'}}>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <SliderField label={sizes[size]} size={size} />
            </div>
        ))}
    </div>
);
