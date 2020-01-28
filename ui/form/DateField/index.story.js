import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withReadme } from 'storybook-readme';
import {text, boolean, select, array} from '@storybook/addon-knobs/react';

import DateField from './DateField';
import README from './README.md'

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('DateField', context => (
        <div>
            {withInfo()(() => (
                <DateField
                    label={text('Label', 'Text')}
                    disabled={boolean('Disabled', DateField.defaultProps.disabled)}
                    required={boolean('Required', DateField.defaultProps.required)}
                    className={text('Class', DateField.defaultProps.className)}
                    placeholder={text('Placeholder', DateField.defaultProps.placeholder)}
                    size={select('Size', sizes, DateField.defaultProps.size)}
                    errors={array('Errors', DateField.defaultProps.errors)}
                />
            ))(context)}

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
        </div>
    ));