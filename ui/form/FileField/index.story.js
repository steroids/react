import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {withReadme} from "storybook-readme";
import {object, boolean, text, select} from "@storybook/addon-knobs/react";

import FileField from './FileField';
import README from './README.md'

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('Form', module)
    .addDecorator(withReadme(README))
    .add('FileField', context => (
        <div>
            {withInfo()(() => (
                <FileField
                    label={text('Label', 'File')}
                    required={boolean('Required', FileField.defaultProps.required)}
                    showRemove={boolean('Show Remove', FileField.defaultProps.showRemove)}
                    buttonProps={object('Button props', FileField.defaultProps.buttonProps)}
                    disabled={boolean('Disabled', FileField.defaultProps.disabled)}
                    multiple={boolean('Multiple', FileField.defaultProps.multiple)}
                    size={select('Size', sizes, FileField.defaultProps.size)}
                    // imagesOnly={boolean('ImageOnly', FileField.defaultProps.imagesOnly)}
                    className={text('Class', FileField.defaultProps.className)}
                />

            ))(context)}
        </div>
    ));
