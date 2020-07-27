import * as React from 'react';
import InputField from '../../InputField';

export default () => (
    <>
        <div className='mb-2'>Inline (label is hide)</div>
        <InputField label='Inline' layout='inline'/>
    </>
);