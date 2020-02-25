import * as React from 'react';

import InputField from '../InputField';

const types = {
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    hidden: 'Hidden',
};

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <InputField label='Input'/>
                <div className='row mb-4'>
                    {Object.keys(sizes).map(size => (
                        <div className='col' key={size}>
                            <InputField label={size} size={size}/>
                        </div>
                    ))}
                </div>
                <div className='row mb-4'>
                    {Object.keys(types).map(type => (
                        <div className='col' key={type}>
                            <InputField label={type} type={type}/>
                        </div>
                    ))}
                </div>
                <div className='row mb-4'>
                    <div className='col'>
                        <InputField label='Disabled' disabled/>
                    </div>
                    <div className='col'>
                        <InputField label='Required' required/>
                    </div>
                    <div className='col'>
                        <InputField label='Placeholder' placeholder='Your text...'/>
                    </div>
                    <div className='col'>
                        <InputField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                    </div>
                </div>
            </>
        );
    }
}