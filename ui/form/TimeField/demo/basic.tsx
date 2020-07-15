import * as React from 'react';

import TimeField from '../TimeField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        <TimeField
            label={'Time'}
        />
        <div className='row mb-4'>
            {Object.keys(sizes).map(size => (
                <div className='col' key={size}>
                    <TimeField label={size} size={size}/>
                </div>
            ))}
        </div>
        <div className='row'>
            <div className='col'>
                <TimeField label='Disabled' disabled/>
            </div>
            <div className='col'>
                <TimeField label='Required' required/>
            </div>
            <div className='col'>
                <TimeField label='Placeholder' placeholder='Your time...'/>
            </div>
            <div className='col'>
                <TimeField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
            </div>
        </div>
    </>
);
