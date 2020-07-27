import * as React from 'react';
import TextField from '../TextField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        {Object.keys(sizes).map(size => (
            <div className='col' key={size}>
                <TextField label={size} size={size}/>
            </div>
        ))}
    </>
);