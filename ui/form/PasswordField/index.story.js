import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import {withReadme} from "storybook-readme";
import {text, boolean, select, array} from '@storybook/addon-knobs/react';

import PasswordField from './PasswordField';
import README from './README.md'

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('PasswordField', context => (
        <div>
            {withInfo()(() => (
                <PasswordField
                    label={text('Label', 'Password')}
                    disabled={boolean('Disabled', PasswordField.defaultProps.disabled)}
                    required={boolean('Required', PasswordField.defaultProps.required)}
                    className={text('Class', PasswordField.defaultProps.className)}
                    placeholder={text('Placeholder', PasswordField.defaultProps.placeholder)}
                    size={select('Size', sizes, PasswordField.defaultProps.size)}
                    security={boolean('Security', PasswordField.defaultProps.security)}
                    errors={array('Errors', PasswordField.defaultProps.errors)}
                />
            ))(context)}

            <div className='row mb-4'>
                {Object.keys(sizes).map(size => (
                    <div className='col' key={size}>
                        <PasswordField label={size} size={size}/>
                    </div>
                ))}
            </div>
            <div className='row'>
                <div className='col'>
                    <PasswordField label='Disabled' disabled/>
                </div>
                <div className='col'>
                    <PasswordField label='Required' required/>
                </div>
                <div className='col'>
                    <PasswordField label='Placeholder' placeholder='Your password...'/>
                </div>
                <div className='col'>
                    <PasswordField label='Security' security/>
                </div>
                <div className='col'>
                    <PasswordField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                </div>
            </div>
        </div>
    ));
