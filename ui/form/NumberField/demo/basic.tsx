import * as React from 'react';

import NumberField from '../NumberField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <NumberField label='Amount'/>
                <div className='row mb-4'>
                    {Object.keys(sizes).map(size => (
                        <div className='col' key={size}>
                            <NumberField label={size} size={size}/>
                        </div>
                    ))}
                </div>
                <div className='row'>
                    <div className='col'>
                        <NumberField label='Disabled' disabled/>
                    </div>
                    <div className='col'>
                        <NumberField label='Required' required/>
                    </div>
                    <div className='col'>
                        <NumberField label='Placeholder' placeholder='Your number...'/>
                    </div>
                    <div className='col'>
                        <NumberField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                    </div>
                </div>
            </>
        );
    }
}