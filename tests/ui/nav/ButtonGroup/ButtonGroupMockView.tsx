import React from 'react';

import {useBem} from '../../../../src/hooks';
import {Button} from '../../../../src/ui/form';
import {IButtonGroupViewProps} from '../../../../src/ui/nav/ButtonGroup/ButtonGroup';

export default function ButtonGroupView(props: IButtonGroupViewProps) {
    const bem = useBem('ButtonGroupView');

    return (
        <div
            className={bem(
                bem.block({
                    size: props.size,
                }),
                props.className,
            )}
            style={props.style}
        >
            {props.items.map((item, index) => {
                const isActive = props.activeButton === item.id;

                return (
                    <Button
                        key={index}
                        className={bem.element('button', {
                            default: !isActive,
                            active: isActive,
                        })}
                        label={item.label}
                        onClick={() => props.onClick(item.id)}
                        {...props.buttonProps}
                    />
                );
            })}
        </div>
    );
}
