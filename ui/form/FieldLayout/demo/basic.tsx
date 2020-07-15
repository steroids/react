import * as React from 'react';
import InputField from '../../InputField';

const layouts = {
    default: 'Default',
    horizontal: 'Horizontal',
    inline: 'Inline',
};

export default () => (
    <>
        <div className='row md-4'>
            <div className='col-8'>
                <InputField label='Default' layout='default'/>
            </div>
        </div>
        <div className='row md-4'>
            <div className='col-8'>
                <InputField label='Horizontal' layout='horizontal'/>
            </div>
        </div>
        <div className='row mb-4'>
            <div className='col-8'>
                <div className='mb-2'>Inline (label is hide)</div>
                <InputField label='Inline' layout='inline'/>
            </div>
        </div>
    </>
);