import * as React from 'react';

import Button from '../Button';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Sizes
 * @order 2
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <div>
                    <a
                        target={'_blank'}
                        href={'https://github.com/steroids/react/blob/master/ui/form/Button/demo/sizes.tsx'}>
                        Github
                    </a>
                </div>
                {Object.keys(sizes).map(size => (
                    <Button
                        key={size}
                        size={size}
                        className='float-left mr-2'
                    >
                        {sizes[size]}
                    </Button>
                ))}
            </>
        );
    }
}
