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
                <div>
                    <a
                        target={'_blank'}
                        href={'https://github.com/steroids/react/blob/master/ui/form/Button/demo/link.tsx'}>
                        Github
                    </a>
                </div>
                <br/>
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
