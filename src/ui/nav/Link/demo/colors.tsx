import * as React from 'react';
import Link from '../Link';

const colors = {
    primary: 'Primary',
    secondary: 'Secondary',
    success: 'Success',
    danger: 'Danger',
    warning: 'Warning',
    info: 'Info',
    light: 'Light',
    dark: 'Dark',
};

/**
 * Colors
 * @order 4
 * @col 8
 */
export default () => (
    <>
        {Object.keys(colors).map(color => (
            <Link
                url='https://google.ru'
                target='_blank'
                key={color}
                color={color}
                label={colors[color]}
                className='d-inline-block mb-3'
            />
        ))}
    </>
);
