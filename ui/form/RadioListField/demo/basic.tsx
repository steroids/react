import * as React from 'react';

import RadioListField from '../RadioListField';

const items = [
    {
        id: 1,
        label: 'First',
    },
    {
        id: 2,
        label: 'Second',
    },
    {
        id: 3,
        label: 'Third',
    },
    {
        id: 4,
        label: 'Fourth',
    },
];

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <RadioListField
                    label='Choose type'
                />
                <div className='row mb-4'>
                    <div className='col-2'>
                        <RadioListField
                            label='Disabled'
                            disabled
                            items={items}
                        />
                    </div>
                    <div className='col-2'>
                        <RadioListField
                            label='Required'
                            required
                            items={items}
                        />
                    </div>
                    <div className='col-2'>
                        <RadioListField
                            label='Errors'
                            errors={['Error 1 text', 'Error 2 text']}
                            items={items}
                        />
                    </div>
                </div>
            </>
        );
    }
}