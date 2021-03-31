import * as React from 'react';
import DateTimeField from '../DateTimeField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        <div className='row mb-4'>
            {Object.keys(sizes).map(size => (
                <div className='col' key={size}>
                    <DateTimeField label={size} size={size}/>
                </div>
            ))}
        </div>
    </>
);