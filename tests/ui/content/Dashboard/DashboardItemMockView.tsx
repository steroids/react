import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {Icon} from '../../../../src/ui/content';
import {IDashboardItemViewProps} from '../../../../src/ui/content/Dashboard/Dashboard';
import {Title} from '../../../../src/ui/typography';

export default function DashboardItemView(props: IDashboardItemViewProps) {
    const bem = useBem('DashboardItemView');

    return (
        <div className={bem.block()}>
            <div className={bem.element('header')}>
                {props.iconName && <Icon name={props.iconName} /> }
                <Title
                    content={props.title}
                    type='h3'
                />
            </div>
            {props.children}
        </div>
    );
}
