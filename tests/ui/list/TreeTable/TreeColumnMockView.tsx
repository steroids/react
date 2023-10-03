import React from 'react';
import {useBem} from '../../../../src/hooks';
import Format from '../../../../src/ui/format/Format';
import {Icon} from '../../../../src/ui/content';
import {ITreeColumnViewProps} from '../../../../src/ui/list/TreeTable/TreeTable';

const DEFAULT_PADDING_LEFT = 32;
const PADDING_WITH_ICON = 0;
const PADDING_WITHOUT_ICON = 24;

export default function TreeColumnView(props: ITreeColumnViewProps) {
    const bem = useBem('TreeColumnView');

    const levelPadding = props.levelPadding || DEFAULT_PADDING_LEFT;
    const iconPadding = props.item.hasItems ? PADDING_WITH_ICON : PADDING_WITHOUT_ICON;

    const renderFormat = () => (
        <Format
            {...props}
            {...(props.formatter || {})}
            attribute={props.attribute}
        />
    );

    const renderValue = () => (
        <span className={bem.element('value')}>
            {renderFormat()}
        </span>
    );

    return (
        <div className={bem.block(bem.block({
            size: props.size,
        }))}
        >
            <div
                className={bem.element('data')}
                style={{
                    paddingLeft: `${props.item.level * levelPadding + iconPadding}px`,
                }}
            >
                {props.item.hasItems && (
                    <Icon
                        name='expand_right'
                        className={bem.element('icon', {
                            opened: props.item.isOpened,
                        })}
                        onClick={() => props.item.onTreeItemClick(props.item.uniqueId, props.item)}
                    />
                )}
                {renderValue()}
            </div>
        </div>
    );
}
