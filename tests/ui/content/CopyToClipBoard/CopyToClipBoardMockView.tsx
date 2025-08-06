/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import useBem from '../../../../src/hooks/useBem';
import {ICopyToClipboardViewProps} from '../../../../src/ui/content/CopyToClipboard/CopyToClipboard';
import {Icon} from '../../../../src/ui/content';

function CopyToClipBoardView(props: ICopyToClipboardViewProps) {
    const bem = useBem('CopyToClipBoardView');

    return (
        <div
            className={bem(bem.block({
                disabled: props.disabled,
            }))}
            onClick={props.onClick}
        >
            {props.children}
            {props.showCopyIcon && (
                <Icon
                    name="mockIcon"
                    className={bem.element('icon')}
                />
            )}
        </div>
    );
}

export default CopyToClipBoardView;
