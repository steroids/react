import React from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {withReadme} from 'storybook-readme';
import {text, boolean, select, array} from '@storybook/addon-knobs/react';

import TextField from './TextField';
import README from './README.md'

TextField.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    hint: PropTypes.string,
    attribute: PropTypes.string,
    input: PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.any,
        onChange: PropTypes.func,
    }),
    required: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    inputProps: PropTypes.object,
    onChange: PropTypes.func,
    className: PropTypes.string,
    view: PropTypes.elementType,
};


const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('TextField', context => (
        <div>
            {withInfo()(() => (
                <TextField
                    label={text('Label', 'Message')}
                    disabled={boolean('Disabled', TextField.defaultProps.disabled)}
                    required={boolean('Required', TextField.defaultProps.required)}
                    className={text('Class', TextField.defaultProps.className)}
                    placeholder={text('Placeholder', TextField.defaultProps.placeholder)}
                    size={select('Size', sizes, TextField.defaultProps.size)}
                    submitOnEnter={boolean('SubmitOnEnter', TextField.defaultProps.submitOnEnter)}
                    errors={array('Errors', TextField.defaultProps.errors)}
                />
            ))(context)}

            <div className='row mb-4'>
                {Object.keys(sizes).map(size => (
                    <div className='col' key={size}>
                        <TextField label={size} size={size}/>
                    </div>
                ))}
            </div>
            <div className='row'>
                <div className='col'>
                    <TextField label='Disabled' disabled/>
                </div>
                <div className='col'>
                    <TextField label='Required' required/>
                </div>
                <div className='col'>
                    <TextField label='Placeholder' placeholder='Your password...'/>
                </div>
                <div className='col'>
                    <TextField label='Submit On Enter' submitOnEnter/>
                </div>
                <div className='col'>
                    <TextField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                </div>
            </div>
        </div>
    ));
