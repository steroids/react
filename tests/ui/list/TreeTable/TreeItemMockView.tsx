import * as React from 'react';
import useBem from '../../../../src/hooks/useBem';
import {ITreeItemViewProps} from '../../../../src/ui/nav/Tree/Tree';
import {Icon} from '../../../../src/ui/content';

const PADDING_WITH_ICON = 0;
const PADDING_WITHOUT_ICON = 24;

export default function TreeItemView(props: ITreeItemViewProps) {
    const bem = useBem('TreeItemView');

    const paddingBasedOnIcon = props.item.hasItems ? PADDING_WITH_ICON : PADDING_WITHOUT_ICON;

    return (
        <div
            key={props.item.uniqueId}
            className={bem(bem.block({
                selected: props.item.isSelected,
                opened: props.item.isOpened,
                'has-items': props.item.hasItems,
                level: props.item.level,
            }), props.className)}
            style={{
                paddingLeft: `${props.item.level * props.levelPadding + paddingBasedOnIcon}px`,
            }}
            onClick={props.item.onClick}
            onKeyDown={(e) => e.key === 'Enter' && props.item.onClick(e)}
            role='button'
            tabIndex={0}
        >
            {props.item.hasItems && (
                <Icon
                    name='mockIcon'
                    className={bem.element('icon', {
                        opened: props.item.isOpened,
                    })}
                    tabIndex={-1}
                />
            )}
            <div className={bem.element('item')}>
                {props.children}
            </div>
        </div>
    );
}
