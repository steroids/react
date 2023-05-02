import * as React from 'react';

import {IBemHocOutput} from '../../../../src/hoc/bem';
import {useBem} from '../../../../src/hooks';
import {ILoaderProps} from '../../../../src/ui/layout/Loader/Loader';
import IconMockView from '../../content/Icon/IconMockView';
import Icon from '../../../../src/ui/content/Icon';

export default function LoaderView(props:ILoaderProps & IBemHocOutput) {
    const bem = useBem('LoaderView');
    return (
        <div className={bem.block()}>
            <div className={bem.element('loader', {
                size: props.size,
                color: props.color,
            })}
            >
                <Icon
                    className={bem.element('icon')}
                    name='mockIcon'
                    view={IconMockView}
                />
            </div>
        </div>
    );
}
