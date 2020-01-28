import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {withReadme} from 'storybook-readme';
import {object} from '@storybook/addon-knobs/react';

import Notifications from './Notifications';
import README from './README.md';

const levels = {
    primary: 'Primary notification',
    secondary: 'Secondary notification',
    success: 'Success notification',
    danger: 'Danger notification',
    warning: 'Warning notification',
    info: 'Info notification',
    light: 'Light notification',
    dark: 'Dark notification',
};

storiesOf('Layout', module)
    .addDecorator(withReadme(README))
    .add('Notification', context => (
        <div>
            {withInfo()(() => (
                <Notifications
                    initialFlashes={object('Initial Flashes', levels)}
                />
            ))(context)}
        </div>
    ));
