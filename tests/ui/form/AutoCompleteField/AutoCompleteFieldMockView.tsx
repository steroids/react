import _isArray from 'lodash-es/isArray';
import * as React from 'react';
import _isEmpty from 'lodash-es/isEmpty';
import {useBem} from '../../../../src/hooks';
import {IAutoCompleteFieldViewProps, IAutoCompleteItem} from '../../../../src/ui/form/AutoCompleteField/AutoCompleteField';
import Text from '../../../../src/ui/typography/Text/Text';
import {Icon} from '../../../../src/ui/content';
import {IBem} from '../../../../src/hooks/useBem';

const normalizeItems = (items: IAutoCompleteItem[]) => {
    const categories: {
        [key: string]: IAutoCompleteItem[],
    } = {};

    const itemsWithoutCategory: IAutoCompleteItem[] = [];

    items.forEach(item => {
        if (item.category) {
            if (categories[item.category]) {
                categories[item.category].push(item);
                return;
            }

            categories[item.category] = [item];
            return;
        }

        itemsWithoutCategory.push(item);
    });

    return {
        categories,
        itemsWithoutCategory,
    };
};

const renderItem = (item: IAutoCompleteItem, props: IAutoCompleteFieldViewProps, bem: IBem) => {
    const hasAdditionalIcon = !!item.additional?.icon;
    const hasAdditionalText = !!item.additional?.text;
    const hasSomeAdditional = hasAdditionalText || hasAdditionalIcon;

    const uniqId = item[props.primaryKey];

    return (
        <button
            key={String(uniqId)}
            className={bem.element('item', {
                hover: props.hoveredId === uniqId,
                select: props.selectedIds.includes(uniqId),
            })}
            onClick={() => props.onItemSelect(uniqId)}
            onFocus={() => props.onItemHover(uniqId)}
            onMouseOver={() => props.onItemHover(uniqId)}
        >
            <span className={bem.element('item-label')}>{item.label}</span>
            {hasSomeAdditional && (
                <div className={bem.element('item-additional')}>
                    {hasAdditionalIcon && (
                        <Icon
                            name={item.additional?.icon}
                            className={bem.element('item-additional-icon')}
                        />
                    )}
                    {hasAdditionalText && (
                        <span className={bem.element('item-additional-text')}>
                            {item.additional && item.additional.text}
                        </span>
                    )}
                </div>
            )}
        </button>
    );
};

export default function AutoCompleteFieldView(props: IAutoCompleteFieldViewProps) {
    const bem = useBem('AutoCompleteFieldView');

    const renderItems = React.useCallback(() => {
        if (!_isEmpty(props.categories)) {
            const {categories, itemsWithoutCategory} = normalizeItems(props.items);

            return (
                <>
                    {Object.entries(categories).map(([category, categoryItems]) => (
                        <div
                            key={category}
                            className={bem.element('category')}
                        >
                            <span className={bem.element('category__label')}>
                                {category}
                            </span>
                            <div className={bem.element('category__content')}>
                                {categoryItems.map(item => renderItem(item, props, bem))}
                            </div>
                        </div>
                    ))}
                    {itemsWithoutCategory.map(item => renderItem(item, props, bem))}
                </>
            );
        }

        return (
            <>
                {props.items.map(item => renderItem(item, props, bem))}
            </>
        );
    }, [bem, props]);

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
                value={
                    _isArray(props.inputProps?.value)
                        ? (props.inputProps.value as (string | number)[])?.join(props.multipleSeparator)
                        : props.inputProps.value as string
                }
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
                    <div className={bem.element('list')}>
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
