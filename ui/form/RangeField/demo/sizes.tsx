import * as React from 'react';
import RangeField from '../RangeField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <RangeField label={size} size={size}/>
            </div>
        ))}
    </>
);