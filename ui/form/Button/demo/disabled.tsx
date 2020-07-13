import * as React from 'react';

import Button from '../Button';

/**
 * Disabled
 * @order 4
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <div>
                    <a
                        target={'_blank'}
                        href={'https://github.com/steroids/react/blob/master/ui/form/Button/demo/disabled.tsx'}>
                        Github
                    </a>
                </div>
                <br/>
                <Button disabled>
                    Disabled
                </Button>
            </>
        );
    }
}
