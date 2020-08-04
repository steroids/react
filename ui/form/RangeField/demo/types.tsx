import * as React from 'react';
import RangeField from '../RangeField';

const types = {
    input: 'Input',
    date: 'Date',
};

export default () => (
    <>
        {Object.keys(types).map(type => (
            <div className='col' key={type}>
                <RangeField label={types[type]} type={type}/>
            </div>
        ))}
    </>
);