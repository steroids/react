/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import {useEffect, useRef} from 'react';

import _isArray from 'lodash-es/isArray';
import Icon from '../../../../src/ui/content/Icon';
import {useBem} from '../../../../src/hooks';
import {IDropDownFieldItem, IDropDownFieldViewProps} from '../../../../src/ui/form/DropDownField/DropDownField';
import DropDownItemView from './DropDownItemMockView';
import IconMockView from '../../content/Icon/IconMockView';
import {Accordion} from '../../../../src/ui/content';

const getSelectedItemsLabel = (selectedItems: Record<string, any>[]): string => (
    selectedItems
        .map(selectedItem => selectedItem.label)
        .join(', ')
);

const getSelectedItemsCount = (selectedItems: Record<string, any>) => {
    if (selectedItems.length <= 1) {
        return selectedItems[0]?.label;
    }

    return `${__('Выбрано')} (${selectedItems.length})`;
};

const toDropDownItem = (props: IDropDownFieldViewProps) => (item: IDropDownFieldItem, itemIndex: number) => (
    <DropDownItemView
        {...props}
        key={itemIndex}
        item={item}
    />
);

export default function DropDownFieldView(props: IDropDownFieldViewProps) {
    const bem = useBem('DropDownFieldView');
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto focus on search
    useEffect(() => {
        if (props.isSearchAutoFocus && props.isAutoComplete && props.isOpened && inputRef?.current) {
            inputRef.current.focus();
        }
    }, [props.isAutoComplete, props.isOpened, props.isSearchAutoFocus]);

    const renderPlaceholder = React.useCallback(() => props.placeholder && !props.selectedIds?.length
        ? (
            <div className={bem.element('placeholder')}>{props.placeholder}</div>
        )
        : null,
        [bem, props.placeholder, props.selectedIds]);

    const renderItems = React.useCallback(() => props.groupAttribute
        ? (
            <Accordion>
                {props.items.map(toDropDownItem(props))}
            </Accordion>
        )
        : (
            <>
                {props.items.map(toDropDownItem(props))}
            </>
        ), [props]);

    return (
        <div
            ref={props.forwardedRef}
            className={bem(bem.block(
                {
                    size: props.size,
                    [`${props.color}`]: !!props.color && !props.outline,
                    [`outline_${props.color}`]: props.outline,
                    opened: props.isOpened,
                },
            ), props.className)}
            onKeyPress={e => e.key === 'Enter' && props.onOpen()}
            style={props.style}
            role="button"
            tabIndex={0}
        >
            <div
                className={bem.element('selected-items', {
                    reset: props.showReset,
                    disabled: props.disabled,
                })}
                onClick={props.onOpen}
                tabIndex={-1}
                role='button'
            >
                {renderPlaceholder()}
                <span
                    className={bem.element('selected-items')}
                >
                    {props.showEllipses
                        ? getSelectedItemsLabel(props.selectedItems)
                        : getSelectedItemsCount(props.selectedItems)}
                </span>
            </div>
            {props.showReset && props.selectedIds.length > 0 && (
                <Icon
                    view={IconMockView}
                    name="mockIcon"
                    className={bem.element('icon-close')}
                    tabIndex={-1}
                    onClick={props.onReset}
                    aria-label='Сбросить'
                />
            )}
            <Icon
                view={IconMockView}
                name='mockIcon'
                className={bem.element('icon-chevron')}
                tabIndex={-1}
                onClick={props.onOpen}
            />
            {props.isOpened && (
                <div className={bem.element('drop-down')}>
                    {props.isAutoComplete && (
                        <div className={bem.element('search', {
                            size: props.size,
                        })}
                        >
                            <Icon
                                view={IconMockView}
                                name='mockIcon'
                                className={bem.element('search-icon')}
                            />
                            <input
                                {...props.searchInputProps}
                                ref={inputRef}
                                onChange={e => props.searchInputProps.onChange(e.target.value)}
                                className={bem(
                                    bem.element('search-input'),
                                    props.searchInputProps.className,
                                )}
                            />
                        </div>
                    )}
                    <div className={bem.element('drop-down-list')}>
                        {renderItems()}
                    </div>
                </div>
            )}
        </div>
    );
}