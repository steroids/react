import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withReadme } from 'storybook-readme';
import {text, boolean, select, array} from '@storybook/addon-knobs/react';

import DateTimeField from './DateTimeField';
import README from './README.md'

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('DateTimeField', context => (
        <div>
            {withInfo()(() => (
                <DateTimeField
                    label={text('Label', 'Start time')}
                    disabled={boolean('Disabled', DateTimeField.defaultProps.disabled)}
                    required={boolean('Required', DateTimeField.defaultProps.required)}
                    className={text('Class', DateTimeField.defaultProps.className)}
                    size={select('Size', sizes, DateTimeField.defaultProps.size)}
                    errors={array('Errors', DateTimeField.defaultProps.errors)}
                />
            ))(context)}

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
        </div>
    ));