import * as React from 'react';

import {useBem} from '../../../../../../src/hooks';
import {IChatInputViewProps} from '../../../../../../src/ui/content/Chat/Chat';
import {Button, FileField, Form, InputField} from '../../../../../../src/ui/form';
import InputFieldMockView from '../../../../form/InputField/InputFieldMockView';
import ChatFileItemMockView from '../ChatFileItem';

const HiddenUploadFileButton = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
    <button
        type='button'
        ref={ref}
        {...props}
    />
));

export default function ChatInputView(props: IChatInputViewProps) {
    const bem = useBem('ChatInputView');

    const filePickerRef = React.useRef(null);

    const onBrowseFile = React.useCallback((e) => {
        e.preventDefault();
        filePickerRef.current.click();
    }, [filePickerRef]);

    const renderInputActions = React.useCallback(() => (
        <div className={bem.element('actions')}>
            <Button
                className={bem.element('action')}
                icon="mockIcon"
                onClick={onBrowseFile}
            />
            <Button
                className={bem.element('action')}
                icon="mockIcon"
                type="submit"
            />
        </div>
    ), [bem, onBrowseFile]);

    return (
        <div className={bem.block()}>
            <Form
                formId={props.chatId}
                className={bem.element('form')}
                onSubmit={props.onSendMessage}
                useRedux
            >
                <InputField
                    className={bem.element('input')}
                    attribute="text"
                    size="lg"
                    placeholder={props.inputPlaceholder}
                    addonAfter={renderInputActions()}
                />
                <FileField
                    className={bem.element('files')}
                    attribute='filesId'
                    itemView={ChatFileItemMockView}
                    buttonView={HiddenUploadFileButton}
                    buttonProps={{
                        ref: filePickerRef,
                    }}
                    multiple={false}
                    showRemove
                    onChange={props.onUploadFiles}
                    {...props.fileFieldProps}
                />
            </Form>
        </div>
    );
}
