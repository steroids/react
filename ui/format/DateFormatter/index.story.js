import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {text} from '@storybook/addon-knobs/react';
import {withReadme} from 'storybook-readme';

import README from './README.md';
import DateFormatter from './DateFormatter';

storiesOf('Format', module)
    .addDecorator(withReadme(README))
    .add('DateFormatter', context => (
        <div>
            {withInfo()(() => (
                <DateFormatter
                    value={text('Value', '2018-05-04' )}
                    format={text('Format', DateFormatter.defaultProps.format)}
                />
            ))(context)}
        </div>
    ));