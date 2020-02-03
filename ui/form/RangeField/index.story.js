import React from 'react';
import {withInfo} from '@storybook/addon-info';
import {storiesOf} from '@storybook/react';
import {withReadme} from 'storybook-readme';
import {text, boolean, select, array} from '@storybook/addon-knobs/react';

import RangeField from './RangeField';
import README from './README.md'

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

const types = {
    input: 'Input',
    date: 'Date',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('RangeField', context => (
        <div>
            {withInfo()(() => (
                <RangeField
                    label={text('Label', 'Range')}
                    disabled={boolean('Disabled', RangeField.defaultProps.disabled)}
                    required={boolean('Required', RangeField.defaultProps.required)}
                    size={select('Size', sizes, RangeField.defaultProps.size)}
                    className={text('Class', RangeField.defaultProps.className)}
                    placeholderFrom={text('Placeholder From', RangeField.defaultProps.placeholderFrom)}
                    placeholderTo={text('Placeholder To', RangeField.defaultProps.placeholderTo)}
                    type={select('Type', types, RangeField.defaultProps.type)}
                    errors={array('Errors', RangeField.defaultProps.errors)}
                />
            ))(context)}
            <div className='row mb-4'>
                {Object.keys(sizes).map(size => (
                    <div className='col' key={size}>
                        <RangeField label={size} size={size}/>
                    </div>
                ))}
            </div>
            <div className='row'>
                <div className='col'>
                    <RangeField label='Disabled' disabled/>
                </div>
                <div className='col'>
                    <RangeField label='Required' required/>
                </div>
                <div className='col'>
                    <RangeField
                        label='Placeholders'
                        placeholderFrom='From...'
                        placeholderTo='To...'
                    />
                </div>
            </div>
            <div className='col'>
                <RangeField
                    type='date'
                    label='Date period'
                />
            </div>
            <div className='col'>
                <RangeField
                    label='Errors'
                    errors={['Error 1 text', 'Error 2 text']}
                />
            </div>

        </div>
    ));
