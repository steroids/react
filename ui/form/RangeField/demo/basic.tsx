import * as React from 'react';

import RangeField from '../RangeField';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

const types = {
    input: 'Input',
    date: 'Date',
};

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <RangeField
                    label='Range'
                />
                {Object.keys(types).map(type => (
                    <div className='col' key={type}>
                        <RangeField label={types[type]} type={type}/>
                    </div>
                ))}
                <div className='row mb-4'>
                    {Object.keys(sizes).map(size => (
                        <div className='col' key={size}>
                            <RangeField label={size} size={size}/>
                        </div>
                    ))}
                </div>
                <div className='row'>
                    <div className='col'>
                        <RangeField label='Disabled' disabled/>
                    </div>
                    <div className='col'>
                        <RangeField label='Required' required/>
                    </div>
                    <div className='col'>
                        <RangeField
                            label='Placeholders'
                            placeholderFrom='From...'
                            placeholderTo='To...'
                        />
                    </div>
                </div>
                <div className='col'>
                    <RangeField
                        type='date'
                        label='Date period'
                    />
                </div>
                <div className='col'>
                    <RangeField
                        label='Errors'
                        errors={['Error 1 text', 'Error 2 text']}
                    />
                </div>
            </>
        );
    }
}
