import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import Link from '../../../../src/ui/nav/Link';
import {INavViewProps} from '../../../../src/ui/nav/Nav/Nav';

export default function NavListView(props: INavViewProps) {
    const bem = useBem('NavListView');

    const renderItems = (items, parentItemProps: any = null) => {
        if (!items || items.length === 0) {
            return null;
        }
        return items.map((item, index) => (
            <li
                key={item.id || index}
                className={bem(bem.element('list-item', {
                    active: item.isActive,
                    disabled: item.disabled,
                }), props.navClassName)}
            >
                <Link
                    onClick={() => props.onClick(item, index)}
                    {...item}
                    disabled={parentItemProps?.disabled || item.disabled}
                />
                {item.items && item.items.length > 0 && (
                    <ul className={bem.element('sub-list')}>
                        {renderItems(item.items, item)}
                    </ul>
                )}
            </li>
        ));
    };

    return (
        <div className={bem(bem.block(), props.className)}>
            <ul className={bem.element('list')}>
                {renderItems(props.items)}
            </ul>
            <div className={bem.element('content')}>
                {props.children}
            </div>
        </div>
    );
}
