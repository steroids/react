import * as React from 'react';
import _isEmpty from 'lodash-es/isEmpty';
import {IBemHocOutput} from '../../../../src/hoc/bem';
import {useBem} from '../../../../src/hooks';
import {IAutoCompleteFieldViewProps, IAutoCompleteItem} from '../../../../src/ui/form/AutoCompleteField/AutoCompleteField';
import Text from '../../../../src/ui/typography/Text/Text';
import {Icon} from '../../../../src/ui/content';
import IconMockView from '../../content/Icon/IconMockView';

const normalizeItems = (items: IAutoCompleteItem[]) => {
    const categories: {
        [key: string]: IAutoCompleteItem[]
    } = {};

    const itemWithoutCategories: IAutoCompleteItem[] = [];

    items.forEach(item => {
        if (item.category) {
            if (categories[item.category]) {
                categories[item.category].push(item);
                return;
            }

            categories[item.category] = [];
            categories[item.category].push(item);
            return;
        }

        itemWithoutCategories.push(item);
    });

    return {
        categories,
        itemWithoutCategories,
    };
};

export default function AutoCompleteFieldView(props: IAutoCompleteFieldViewProps & IBemHocOutput) {
    const bem = useBem('AutoCompleteFieldView');

    const normalizedItems = React.useMemo(() => normalizeItems(props.items), [props.items]);

    const renderItem = React.useCallback((item: IAutoCompleteItem) => {
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
                                {item.additional?.text}
                            </span>
                        )}
                    </div>
                )}
            </button>
        );
    }, [bem, props]);

    const renderItems = () => {
        if (!_isEmpty(props.categories)) {
            return (
                <>
                    {Object.entries(normalizedItems.categories).map(([category, categoryItems]) => (
                        <div
                            key={category}
                            className={bem.element('category')}
                        >
                            <span className={bem.element('category__label')}>
                                {category}
                            </span>
                            <div className={bem.element('category__content')}>
                                {categoryItems.map(renderItem)}
                            </div>
                        </div>
                    ))}
                    {normalizedItems.itemWithoutCategories.map(renderItem)}
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
