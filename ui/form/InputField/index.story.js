import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withReadme } from 'storybook-readme';
import {text, boolean, select, array} from '@storybook/addon-knobs/react';

import InputField from "./InputField";
import README from './README.md'

const types = {
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    hidden: 'Hidden',
};

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('InputField', context => (
        <div>
            {withInfo()(() => (
                <InputField
                    label={text('Label', 'Text')}
                    disabled={boolean('Disabled', InputField.defaultProps.disabled)}
                    required={boolean('Required', InputField.defaultProps.required)}
                    className={text('Class', InputField.defaultProps.className)}
                    size={select('Size', sizes, InputField.defaultProps.size)}
                    type={select('Type', types, InputField.defaultProps.type)}
                    placeholder={text('Placeholder', InputField.defaultProps.placeholder)}
                    errors={array('Errors', InputField.defaultProps.errors)}
                />
            ))(context)}

            <div className='row mb-4'>
                {Object.keys(sizes).map(size => (
                    <div className='col' key={size}>
                        <InputField label={size} size={size}/>
                    </div>
                ))}
            </div>

            <div className='row mb-4'>
                {Object.keys(types).map(type => (
                    <div className='col' key={type}>
                        <InputField label={type} type={type}/>
                    </div>
                ))}
            </div>

            <div className='row mb-4'>
                <div className='col'>
                    <InputField label='Disabled' disabled/>
                </div>
                <div className='col'>
                    <InputField label='Required' required/>
                </div>
                <div className='col'>
                    <InputField label='Placeholder' placeholder='Your text...'/>
                </div>
                <div className='col'>
                    <InputField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                </div>
            </div>
        </div>
));