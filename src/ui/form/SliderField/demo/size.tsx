import * as React from 'react';
import SliderField from '../SliderField';

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
                <SliderField label={sizes[size]} size={size} />
            </div>
        ))}
    </div>
);
