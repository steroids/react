import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import IconMockView from '../../content/Icon/IconMockView';
import {ITextFieldViewProps} from '../../../../src/ui/form/TextField/TextField';

export default function TextFieldView(props: ITextFieldViewProps) {
    const bem = useBem('TextFieldView');

    return (
        <div className={bem(
            bem.block({
                hasErrors: !!props.errors,
                filled: !!props.inputProps.value,
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
            {props.showClose && (
                <Icon
                    view={IconMockView}
                    className={bem.element('close')}
                    name="mockIcon"
                    onClick={props.onClear}
                />
            )}
        </div>
    );
}
