import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {boolean, text} from '@storybook/addon-knobs/react';
import {withReadme} from 'storybook-readme';

import README from './README.md';
import DateTimeFormatter from './DateTimeFormatter';

storiesOf('Format', module)
    .addDecorator(withReadme(README))
    .add('DateTimeFormatter', context => (
        <div>
            {withInfo()(() => (
                <DateTimeFormatter
                    value={text('Value', '2018-05-04' )}
                    format={text('Format', DateTimeFormatter.defaultProps.format)}
                    timeZone={boolean('Time Zone', false)}
                />
            ))(context)}
        </div>
    ));