import * as React from 'react';
import {useBem} from '../../../../src/hooks';
import Format from '../../../../src/ui/format/Format';
import {ITreeColumnViewProps} from '../../../../src/ui/list/TreeTable/TreeTable';
import TreeItemView from './TreeItemMockView';

export default function TreeColumnView(props: ITreeColumnViewProps) {
    const bem = useBem('TreeColumnView');

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
        <TreeItemView
            item={props.item}
            levelPadding={props.levelPadding}
            className={bem.block()}
        >
            {renderValue()}
        </TreeItemView>
    );
}
