import * as React from 'react';

import DateTimeField from '../DateTimeField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <DateTimeField label='DateTime'/>
                <div className='row mb-4'>
                    {Object.keys(sizes).map(size => (
                        <div className='col' key={size}>
                            <DateTimeField label={size} size={size}/>
                        </div>
                    ))}
                </div>
                <div className='row mb-4'>
                    <div className='col'>
                        <DateTimeField label='Disabled' disabled/>
                    </div>
                    <div className='col'>
                        <DateTimeField label='Required' required/>
                    </div>
                    <div className='col'>
                        <DateTimeField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                    </div>
                </div>
            </>
        );
    }
}