import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import {withReadme} from "storybook-readme";
import {select, object} from '@storybook/addon-knobs/react';

import Form from './Form';
import FieldSet from '../FieldSet';
import TextField from '../TextField';
import InputField from '../InputField';
import DateField from '../DateField';
import DateTimeField from '../DateTimeField';
import README from './README.md'
import FieldLayout from "../FieldLayout/FieldLayout";

const layouts = {
    default: 'Default',
    horizontal: 'Horizontal',
    inline: 'Inline',
};


storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('Form', context => (
        <div>
            {withInfo()(() => (
                <Form
                    formId='TestForm'
                    layout={select('Layout', layouts, FieldLayout.defaultProps.layout)}
                    layoutProps={object('Layout columns', FieldLayout.defaultProps.layoutProps)}
                >
                    <FieldSet prefix='user'>
                        <InputField
                            label='Email'
                            attribute='email'
                        />
                        <TextField
                            label='Message'
                            attribute='message'
                            submitOnEnter
                        />
                        <DateField
                            label='Date'
                            attribute='date'
                        />
                        <DateTimeField
                            label='Start time'
                            attribute='startTime'
                        />
                    </FieldSet>
                </Form>
            ))(context)}
        </div>
    ));
