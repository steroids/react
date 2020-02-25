import * as React from 'react';

import NumberField from '../NumberField';


/**
 * Required
 * @order 3
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <NumberField label='Required' required/>
            </>
        );
    }
}
