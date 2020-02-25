import * as React from 'react';

import Button from '../Button';

/**
 * Link
 * @order 5
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <Button
                    link
                    url='https://google.ru'
                    target='_blank'
                    label={__('Link')}
                />
            </>
        );
    }
}
