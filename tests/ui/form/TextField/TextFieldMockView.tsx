import * as React from 'react';

import {IBemHocOutput} from '../../../../src/hoc/bem';
import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import IconMockView from '../../content/Icon/IconMockView';
import {ITextFieldViewProps} from '../../../../src/ui/form/TextField/TextField';

export default function TextFieldView(props: ITextFieldViewProps & IBemHocOutput) {
    const bem = useBem('TextFieldView');

    if (!props.isExist) {
        return null;
    }

    return (
        <div className={bem(
            bem.block({
                hasErrors: !!props.errors,
                successful: props.successful,
            }),
            props.className,
        )}
        >
            <textarea
                className={bem(
                    bem.element('textarea'),
                    bem.block({
                        size: props.size,
                    }),
                )}
                {...props.inputProps}
            />
            {props.showClose && <Icon view={IconMockView} className={bem.element('close')} name="mockIcon" onClick={props.onClose} />}
        </div>
    );
}
