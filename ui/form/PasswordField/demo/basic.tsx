import * as React from 'react';

import PasswordField from '../PasswordField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <PasswordField label='Password'/>
                <div className='row mb-4'>
                    {Object.keys(sizes).map(size => (
                        <div className='col' key={size}>
                            <PasswordField label={size} size={size}/>
                        </div>
                    ))}
                </div>
                <div className='row'>
                    <div className='col'>
                        <PasswordField label='Disabled' disabled/>
                    </div>
                    <div className='col'>
                        <PasswordField label='Required' required/>
                    </div>
                    <div className='col'>
                        <PasswordField label='Placeholder' placeholder='Your password...'/>
                    </div>
                    <div className='col'>
                        <PasswordField label='Security' security/>
                    </div>
                    <div className='col'>
                        <PasswordField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                    </div>
                </div>
            </>
        );
    }
}
