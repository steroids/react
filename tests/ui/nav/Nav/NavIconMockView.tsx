import * as React from 'react';
import Button from '../../../../src/ui/form/Button';
import {INavViewProps} from '../../../../src/ui/nav/Nav/Nav';
import {useBem} from '../../../../src/hooks';

export default function NavIconView(props: INavViewProps) {
    const bem = useBem('NavIconView');
    return (
        <div className={bem(bem.block(), props.className)}>
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
                            icon='mockIcon'
                            link
                            onClick={() => props.onClick(item, index)}
                            {...item}
                            label={null}
                            hint={item.hint || item.label || null}
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
