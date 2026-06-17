/* eslint-disable jsx-a11y/click-events-have-key-events */
import {useBem} from '@steroidsjs/core/hooks';
import {Icon, DropDown} from '@steroidsjs/core/ui/content';
import {IPhoneFieldDropdownProps} from '@steroidsjs/core/ui/form/PhoneField/PhoneField';
import {useCallback, useEffect, useRef, useState} from 'react';

const INITIAL_PAGE_SIZE = 40;
const PAGE_SIZE = 40;
const SCROLL_THRESHOLD = 80;

interface IDropDownCountrySelectViewProps extends IPhoneFieldDropdownProps {
    disabled?: boolean,
}

export default function DropDownCountrySelectView(props: IDropDownCountrySelectViewProps) {
    const bem = useBem('DropDownCountrySelectView');
    const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
    const listRef = useRef<HTMLDivElement>(null);

    const selectedCountry = props.selectedItems[0] as unknown as any;
    const items = props.items ?? [];
    const visibleItems = items.slice(0, visibleCount);
    const hasMore = visibleCount < items.length;

    useEffect(() => {
        if (!props.isOpened) {
            setVisibleCount(INITIAL_PAGE_SIZE);
        }
    }, [props.isOpened]);

    const handleScroll = useCallback(() => {
        const el = listRef.current;
        if (!el || !hasMore) {
            return;
        }
        const {scrollTop, clientHeight, scrollHeight} = el;
        if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
            setVisibleCount(prev => Math.min(prev + PAGE_SIZE, items.length));
        }
    }, [hasMore, items.length]);

    const renderList = useCallback(() => (
        <div
            className={bem.element('drop-down')}
        >
            <div
                ref={listRef}
                className={bem.element('drop-down-list')}
                onScroll={handleScroll}
            >
                {visibleItems.map((item) => (
                    <button
                        key={String(item[props.primaryKey])}
                        type='button'
                        className={bem.element('drop-down-item', {
                            select: props.selectedIds.includes(item[props.primaryKey]),
                        })}
                        onClick={e => {
                            e.preventDefault();
                            props.onItemSelect(item[props.primaryKey]);
                        }}
                    >
                        <span className={bem.element('img')}>
                            <img
                                src={item.contentSrc as string}
                                alt='custom source for item'
                            />
                        </span>
                        <div className={bem.element('country-name')}>
                            <p className={bem.element('text')}>
                                {item.label}
                            </p>
                            <p className={bem.element('code')}>
                                {item.phoneCode}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    ), [bem, props, visibleItems, handleScroll]);

    const closeIfOpened = useCallback(() => {
        if (props.isOpened) {
            props.onClose();
        }
    }, [props]);

    return (
        <DropDown
            content={renderList}
            visible={props.isOpened}
            onClose={props.onClose}
            hasArrow={false}
            className={bem.element('wrapper')}
        >
            <div
                className={bem(
                    bem.block({
                        opened: props.isOpened,
                    }),
                )}
                onKeyPress={e => e.key === 'Enter' && !props.disabled && props.onOpen()}
                role='button'
                tabIndex={0}
                onClick={closeIfOpened}
            >
                <div
                    className={bem.element('selected-items')}
                    tabIndex={-1}
                    role='button'
                    onClick={props.onOpen}
                >
                    <img
                        src={selectedCountry.contentSrc as string}
                        alt='custom source for item'
                    />
                    <Icon
                        name='arrow_down_24x24'
                        className={bem.element('icon-chevron')}
                        tabIndex={-1}
                        onClick={props.onOpen}
                    />
                </div>
            </div>
        </DropDown>
    );
}
