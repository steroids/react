import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {IProgressBarViewProps} from '../../../../src/ui/layout/ProgressBar/ProgressBar';

export default function LineProgressBarView(props: IProgressBarViewProps) {
    const bem = useBem('LineProgressBarView');

    return (
        <div className={bem.block({
            size: props.size,
            status: props.status,
        })}
        >
            <div className={bem.element('emptyLine')}>
                <div
                    className={bem.element('progressLine')}
                    style={{width: `${props.percent}%`}}
                />
            </div>
            <div className={bem.element('text')}>{props.label}</div>
        </div>
    );
}
