import * as React from 'react';

import Button from '../../../../src/ui/form/Button';

import {INavViewProps} from '../../../../src/ui/nav/Nav/Nav';
import {useBem} from '../../../../src/hooks';

export default function NavTabsView(props: INavViewProps) {
    const bem = useBem('NavTabsView');
    return (
        <div
            className={bem(bem.block({
                size: props.size,
            }), props.className)}
        >
            <ul className={bem.element('list')}>
                {props.items.map((item, index) => (
                    <li
                        key={item.id || index}
                        className={bem(bem.element('list-item', {
                            active: item.isActive,
                            disabled: item.disabled,
                        }), props.navClassName)}
                    >
                        <Button
                            size={props.size}
                            link={!item.isActive}
                            onClick={() => props.onClick(item, index)}
                            {...item}
                        />
                    </li>
                ))}
            </ul>
            <div className={bem.element('content')}>
                {props.children}
            </div>
        </div>
    );
}
