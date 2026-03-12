import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import {ILoaderProps} from '../../../../src/ui/layout/Loader/Loader';
import IconMockView from '../../content/Icon/IconMockView';

export default function LoaderView(props: ILoaderProps) {
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
