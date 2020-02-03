import React from 'react';
import {storiesOf} from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import {withReadme} from 'storybook-readme';
import {text, select, object} from '@storybook/addon-knobs/react';
import InputField from '../InputField';
import FieldLayout from './FieldLayout';
import README from './README.md'

const layouts = {
    default: 'Default',
    horizontal: 'Horizontal',
    inline: 'Inline',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('FieldLayout', context => (
        <div>
            {withInfo()(() => (
                <InputField
                    label={text('Label', 'Text')}
                    layout={select('Layout', layouts, FieldLayout.defaultProps.layout)}
                    layoutProps={object('Layout props', FieldLayout.defaultProps.layoutProps)}
                />
            ))(context)}

            <div className='row md-4'>
                <div className='col-8'>
                    <InputField label='Default' layout='default'/>
                </div>
            </div>
            <div className='row md-4'>
                <div className='col-8'>
                    <InputField label='Horizontal' layout='horizontal'/>
                </div>
            </div>
            <div className='row mb-4'>
                <div className='col-8'>
                    <div className='mb-2'>Inline (label is hide)</div>
                    <InputField label='Inline' layout='inline'/>
                </div>
            </div>

        </div>
    ));
