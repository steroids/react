import * as React from 'react';

import TextField from '../TextField';


const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <div className='row mb-4'>
                    {Object.keys(sizes).map(size => (
                        <div className='col' key={size}>
                            <TextField label={size} size={size}/>
                        </div>
                    ))}
                </div>
                <div className='row'>
                    <div className='col'>
                        <TextField label='Disabled' disabled/>
                    </div>
                    <div className='col'>
                        <TextField label='Required' required/>
                    </div>
                    <div className='col'>
                        <TextField label='Placeholder' placeholder='Your password...'/>
                    </div>
                    <div className='col'>
                        <TextField label='Submit On Enter' submitOnEnter/>
                    </div>
                    <div className='col'>
                        <TextField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                    </div>
                </div>
            </>
        );
    }
}
