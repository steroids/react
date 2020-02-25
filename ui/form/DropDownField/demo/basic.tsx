import * as React from 'react';

import DropDownField from '../DropDownField';

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
                <DropDownField
                    label='Dropdown'
                    items={items}
                />

                <div className='row mb-4'>
                    <div className='col'>
                        <DropDownField
                            label='Disabled'
                            disabled
                            items={items}
                        />
                    </div>
                    <div className='col'>
                        <DropDownField
                            label='Required'
                            required
                            items={items}
                        />
                    </div>
                    <div className='col'>
                        <DropDownField
                            label='Show reset'
                            showReset
                            items={items}
                        />
                    </div>
                </div>

                <div className='row mb-4'>
                    <div className='col'>
                        <DropDownField
                            label='Auto Complete'
                            autoComplete
                            items={items}

                        />
                    </div>
                    <div className='col'>
                        <DropDownField
                            label='Search Placeholder'
                            autoComplete
                            searchPlaceholder='Search...'
                            items={items}
                        />
                    </div>
                    <div className='col'>
                        <DropDownField
                            label='Multiple'
                            multiple
                            items={items}
                        />
                    </div>
                    <div className='col'>
                        <DropDownField
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
