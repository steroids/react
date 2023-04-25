import * as React from 'react';
import _isEmpty from 'lodash-es/isEmpty';
import {IBemHocOutput} from '../../../../src/hoc/bem';
import {useBem} from '../../../../src/hooks';
import {IAutoCompleteFieldViewProps} from '../../../../src/ui/form/AutoCompleteField/AutoCompleteField';
import Text from '../../../../src/ui/typography/Text/Text';
import {Icon} from '../../../../src/ui/content';
import IconMockView from '../../content/Icon/IconMockView';

export default function AutoCompleteFieldView(props: IAutoCompleteFieldViewProps & IBemHocOutput) {
    const bem = useBem('AutoCompleteFieldView');

    const renderItems = () => {
        const renderItem = (item: any) => {
            const hasAdditionalIcon = !!item.additional?.icon;
            const hasAdditionalText = !!item.additional?.text;
            const hasAnyAdditional = hasAdditionalText || hasAdditionalIcon;

            return (
                <button
                    key={String(item[props.primaryKey])}
                    className={bem.element('drop-down-item', {
                        hover: props.hoveredId === item[props.primaryKey],
                        select: props.selectedIds.includes(item[props.primaryKey]),
                    })}
                    onClick={() => props.onItemSelect(item[props.primaryKey])}
                    onFocus={() => props.onItemHover(item[props.primaryKey])}
                    onMouseOver={() => props.onItemHover(item[props.primaryKey])}
                >
                    <span className={bem.element('drop-down-item-label')}>{item.label}</span>
                    {hasAnyAdditional && (
                        <div className={bem.element('drop-down-item-additional')}>
                            {hasAdditionalIcon && (
                                <Icon
                                    view={IconMockView}
                                    name={item.additional?.icon}
                                    className={bem.element('drop-down-item-additional-icon')}
                                />
                            )}
                            {hasAdditionalText && (
                                <span className={bem.element('drop-down-item-additional-text')}>
                                    {item.additional.text}
                                </span>
                            )}
                        </div>
                    )}
                </button>
            );
        };

        if (!_isEmpty(props.categories)) {
            return (
                <>
                    {props.categories.map((category, categoryIndex) => (
                        <div
                            key={categoryIndex}
                            className={bem.element('category', {
                                hidden: !props.items.find((item) => item.category === category),
                            })}
                        >
                            <span className={bem.element('category__label')}>
                                {category}
                            </span>
                            <div className={bem.element('category__content')}>
                                {props.items.map((item) => (
                                    category === item.category && renderItem(item)
                                ))}
                            </div>
                        </div>
                    ))}
                    {props.items.map((item) => !item.category && renderItem(item))}
                </>
            );
        }

        return (
            <>
                {props.items.map(renderItem)}
            </>
        );
    };

    return (
        <div
            ref={props.forwardedRef}
            className={bem(
                bem.block({
                    size: props.size,
                    opened: props.isOpened,
                }), props.className,
            )}
            style={props.style}
        >
            <input
                {...props.inputProps}
                className={bem(
                    bem.element('input'),
                    props.inputProps.className,
                )}
                onClick={(e) => {
                    e.preventDefault();
                    props.onOpen();
                }}
                onChange={e => props.inputProps.onChange(e.target.value)}
                placeholder={props.placeholder}
                disabled={props.disabled}
                required={props.required}
            />
            {true && (
                <div className={bem.element('drop-down')}>
                    <div className={bem.element('drop-down-list')}>
                        {!_isEmpty(props.items)
                            ? renderItems()
                            : (
                                <Text
                                    type='textSm'
                                    content={__('Nothing was found')}
                                    className={bem.element('nothing')}
                                />
                            )}
                    </div>
                </div>
            )}
        </div>
    );
}
