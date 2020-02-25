import * as React from 'react';

import DateField from '../DateField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <DateField
                    label={'Date'}
                />
                <div className='row mb-4'>
                    {Object.keys(sizes).map(size => (
                        <div className='col' key={size}>
                            <DateField label={size} size={size}/>
                        </div>
                    ))}
                </div>
                <div className='row'>
                    <div className='col'>
                        <DateField label='Disabled' disabled/>
                    </div>
                    <div className='col'>
                        <DateField label='Required' required/>
                    </div>
                    <div className='col'>
                        <DateField label='Placeholder' placeholder='Your date...'/>
                    </div>
                    <div className='col'>
                        <DateField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                    </div>
                </div>
            </>
        );
    }
}