import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import {withReadme} from "storybook-readme";
import {text, boolean, number, select, array} from '@storybook/addon-knobs/react';

import NumberField from './NumberField';
import README from './README.md'

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('NumberField', context => (
        <div>
            {withInfo()(() => (
                <NumberField
                    label={text('Label', 'Amount')}
                    disabled={boolean('Disabled', NumberField.defaultProps.disabled)}
                    required={boolean('Required', NumberField.defaultProps.required)}
                    className={text('Class', NumberField.defaultProps.className)}
                    placeholder={text('Placeholder', NumberField.defaultProps.placeholder)}
                    size={select('Size', sizes, NumberField.defaultProps.size)}
                    step={number('Step', NumberField.defaultProps.step)}
                    min={number('min', NumberField.defaultProps.min)}
                    max={number('max', NumberField.defaultProps.max)}
                    errors={array('Errors', NumberField.defaultProps.errors)}
                />
            ))(context)}

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
        </div>
    ));