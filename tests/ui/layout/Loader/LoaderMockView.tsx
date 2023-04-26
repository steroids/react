import * as React from 'react';

import {IBemHocOutput} from '../../../../src/hoc/bem';
import {useBem} from '../../../../src/hooks';

export default function LoaderView(props: IBemHocOutput) {
    const bem = useBem('LoaderView');
    return (
        <div className={bem.block()}>
            <div className={bem.element('loader')} />
        </div>
    );
}
