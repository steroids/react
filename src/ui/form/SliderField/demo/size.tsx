import * as React from 'react';
import SliderField from '../SliderField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <div className='row'>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <SliderField label={size} size={size} />
            </div>
        ))}
    </div>
);
