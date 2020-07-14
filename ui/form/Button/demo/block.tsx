import * as React from 'react';

import Button from '../Button';

/**
 * Block
 * @order 3
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <div>
                    <a
                        target={'_blank'}
                        href={'https://github.com/steroids/react/blob/master/ui/form/Button/demo/block.tsx'}>
                        Github
                    </a>
                </div>
                <br/>
                <Button
                    block
                    label={__('Block')}
                />
            </>
        );
    }
}
