/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import {IRateFieldViewProps} from '../../../../src/ui/form/RateField/RateField';

export default function RateFieldView(props: IRateFieldViewProps) {
    const bem = useBem('RateFieldView');
    return (
        <div
            className={bem(bem.block({
                size: props.size,
                disabled: props.disabled,
            }), props.className)}
            style={props.style}
        >
            <ul className={bem.element('rate-list')}>
                {props.items.map((item, index) => (
                    <li
                        key={index}
                        className={bem.element('rate-item', {
                            'is-full': item.value <= props.inputProps?.value,
                        })}
                        onClick={(e) => {
                            e.preventDefault();
                            props.onItemClick(item);
                        }}
                    >
                        <span className={bem.element('rate-value-first')}>
                            <Icon
                                className={bem.element('rate-icon')}
                                name='mockIcon'
                            />
                        </span>
                        <span className={bem.element('rate-value-second')}>
                            <Icon
                                className={bem.element('rate-icon')}
                                name='mockIcon'
                            />
                        </span>
                    </li>
                ))}
            </ul>
            {props.badge && <span className={bem.element('badge')}>{props.badge?.title}</span>}
        </div>
    );
}
