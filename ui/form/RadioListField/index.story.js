import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withReadme } from 'storybook-readme';
import {text, boolean, object, array} from '@storybook/addon-knobs/react';

import RadioListField from './RadioListField';
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
    .add('RadioListField', context => (
        <div>
            {withInfo()(() => (
                <RadioListField
                    label={text('Label', 'Choose type')}
                    disabled={boolean('Disabled', RadioListField.defaultProps.disabled)}
                    required={boolean('Required', RadioListField.defaultProps.required)}
                    className={text('Class', RadioListField.defaultProps.className)}
                    items={object('Items', items)}
                    errors={array('Errors', RadioListField.defaultProps.errors)}
                />
            ))(context)}

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
        </div>
    ));