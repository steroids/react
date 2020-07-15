import * as React from 'react';

import Notifications from '../Notifications';

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

export default () => (
    <>
        <Notifications
            initialFlashes={levels}
        />
    </>
);
