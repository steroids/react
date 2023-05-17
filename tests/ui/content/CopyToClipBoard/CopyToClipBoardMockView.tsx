import React from 'react';
import useBem from '../../../../src/hooks/useBem';
import {ICopyToClipboardViewProps} from '../../../../src/ui/content/CopyToClipboard/CopyToClipboard';
import {Icon} from '../../../../src/ui/content';

function CopyToClipBoardView(props: ICopyToClipboardViewProps) {
    const bem = useBem('CopyToClipBoardView');

    return (
        <div className={bem(bem.block({
            disabled: props.disabled,
        }))}
        >
            {props.children}
            {props.showCopyIcon && (
                <Icon
                    name='mockIcon'
                    onClick={props.onClick}
                    className={bem.element('icon')}
                />
            )}

        </div>
    );
}

export default CopyToClipBoardView;
