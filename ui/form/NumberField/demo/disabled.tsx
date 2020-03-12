import * as React from 'react';

import NumberField from '../NumberField';


/**
 * Disabled
 * @order 2
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <NumberField label='Disabled' disabled/>
            </>
        );
    }
}
