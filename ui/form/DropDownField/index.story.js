import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withReadme } from 'storybook-readme';
import {text, boolean, object, array} from '@storybook/addon-knobs/react';

import DropDownField from './DropDownField';
import README from './README.md'

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

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('DropDownField', context => (
        <div>
            {withInfo()(() => (
                <DropDownField
                    label={text('Label', 'Dropdown')}
                    disabled={boolean('Disabled', DropDownField.defaultProps.disabled)}
                    required={boolean('Required', DropDownField.defaultProps.required)}
                    className={text('Class', DropDownField.defaultProps.className)}
                    showReset={boolean('Show Reset', DropDownField.defaultProps.showReset)}
                    autoComplete={boolean('Auto Complete', DropDownField.defaultProps.autoComplete)}
                    // autoCompleteMinLength={number('Auto Complete Min Length')}
                    // autoCompleteDelay={number('Auto Complete Delay')}
                    searchPlaceholder={text('Search Placeholder', DropDownField.defaultProps.searchPlaceholder)}
                    multiple={boolean('Multiple', DropDownField.defaultProps.multiple)}
                    items={object('Items', items)}
                    errors={array('Errors', [])}
                />
            ))(context)}

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
        </div>
    ));
