import * as React from 'react';

import NumberField from '../NumberField';


/**
 * Placeholder
 * @order 4
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <NumberField label='Placeholder' placeholder='Your number...'/>
            </>
        );
    }
}
