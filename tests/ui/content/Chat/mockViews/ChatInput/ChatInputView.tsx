import * as React from 'react';
import {Button, Form, InputField} from '../../../../../../src/ui/form';
import {useBem} from '../../../../../../src/hooks';

interface IChatInputProps {
    chatId: string;
    onSendMessage: (data) => void;
}

export default function ChatInputView(props: IChatInputProps) {
    const bem = useBem('ChatInputView');

    const renderInputActions = React.useCallback(() => (
        <div
            className={bem.element('actions')}
        >
            <Button
                className={bem.element('action')}
                icon="mockIcon"
                type="submit"
            />
        </div>
    ), [bem]);

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
                    required
                    placeholder="Введите сообщение"
                    addonAfter={renderInputActions()}
                />
            </Form>
        </div>
    );
}
