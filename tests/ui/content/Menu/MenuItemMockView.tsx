import React from 'react';

import {useBem} from '../../../../src/hooks';
import {IMenuItem} from '../../../../src/ui/content/Menu/Menu';
import renderIcon from '../../../mocks/renderIconMock';

export default function MenuItemView(props: IMenuItem) {
    const bem = useBem('MenuItemView');
    return (

        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
            className={bem.block({hasBorder: props.hasBorder})}
            onClick={props.onClick}
        >
            {props.icon
                ? renderIcon(props.icon, {className: bem.element('icon')})
                : (<div className={bem.element('none-icon')} />)}

            <span className={bem.element('label')}>
                {props.label}
            </span>
        </div>
    );
}
