import * as React from 'react';
import TimeField from "../TimeField";

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <TimeField label={size} size={size}/>
            </div>
        ))}
    </>
);