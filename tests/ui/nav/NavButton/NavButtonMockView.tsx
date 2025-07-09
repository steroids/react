import * as React from 'react';
import Button from '../../../../src/ui/form/Button';
import {INavViewProps} from '../../../../src/ui/nav/Nav/Nav';
import {useBem} from '../../../../src/hooks';

export default function NavButtonView(props: INavViewProps) {
    const bem = useBem('NavButtonView');
    return (
        <div className={bem(bem.block(), props.className)}>
            <div className={bem(props.children && 'mb-3', bem.element('nav'))}>
                {props.items.map((item, index) => (
                    <Button
                        key={item.id || index}
                        color='secondary'
                        outline={!item.isActive}
                        disabled={props.disabled}
                        onClick={() => props.onClick(item, index)}
                        className={bem.element('nav-item')}
                        {...item}
                    />
                ))}
            </div>
            <div className={bem.element('content')}>
                {props.children}
            </div>
        </div>
    );
}
