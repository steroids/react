import * as React from 'react';

import {IBemHocOutput} from '../../../../src/hoc/bem';
import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import IconMockView from '../../content/Icon/IconMockView';
import {ITextFieldViewProps} from '../../../../src/ui/form/TextField/TextField';

export default function TextFieldView(props: ITextFieldViewProps & IBemHocOutput) {
    const bem = useBem('TextFieldView');

    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    const clearHandler = () => {
        if (!textAreaRef.current) {
            return;
        }

        if (props.onClear) {
            props.onClear();
        }

        props.input?.onChange('');
        textAreaRef.current.value = '';
    };

    return (
        <div className={bem(
            bem.block({
                hasErrors: !!props.errors,
                successful: props.successful,
                filled: !!textAreaRef.current?.value,
            }),
            props.className,
        )}
        >
            <textarea
                ref={textAreaRef}
                className={bem(
                    bem.element('textarea'),
                    bem.block({
                        size: props.size,
                    }),
                )}
                {...props.inputProps}
            />
            {props.showClose && <Icon view={IconMockView} className={bem.element('close')} name="mockIcon" onClick={clearHandler} />}
        </div>
    );
}
