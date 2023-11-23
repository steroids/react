import * as React from 'react';
import {useBem} from '../../../../src/hooks';
import Format from '../../../../src/ui/format/Format';
import {Icon} from '../../../../src/ui/content';
import {ITreeColumnViewProps} from '../../../../src/ui/list/TreeTable/TreeTable';

const PADDING_WITH_ICON = 0;
const PADDING_WITHOUT_ICON = 24;

export default function TreeColumnView(props: ITreeColumnViewProps) {
    const bem = useBem('TreeColumnView');

    const paddingBasedOnIcon = props.item.hasItems ? PADDING_WITH_ICON : PADDING_WITHOUT_ICON;

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
        <div
            className={bem.block(bem.block({
                size: props.size,
            }))}
            onClick={props.item.onClick}
            onKeyDown={(e) => e.key === 'Enter' && props.item.onClick()}
            role='button'
            tabIndex={0}
        >
            <div
                className={bem.element('data')}
                style={{
                    paddingLeft: `${props.item.level * props.levelPadding + paddingBasedOnIcon}px`,
                }}
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
                {renderValue()}
            </div>
        </div>
    );
}
