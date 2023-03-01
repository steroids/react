import * as React from 'react';

import Button from '../Button';

/**
 * Использвание кнопки в качестве ссылки.
 * @order 9
 * @col 4
 */

export default () => {
    <Button
        link
        url='https://google.ru'
        target='_blank'
        label={__('Link')}
    />
}