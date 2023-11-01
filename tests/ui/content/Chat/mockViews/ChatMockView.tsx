import * as React from 'react';
import {useBem} from '../../../../../src/hooks';
import {IChatViewProps} from '../../../../../src/ui/content/Chat/Chat';

import ChatInputView from './ChatInput';
import BubblesDateGroup from './BubblesDateGroup';

export default function ChatView(props: IChatViewProps) {
    const bem = useBem('ChatView');

    const renderChatScreen = React.useCallback(() => (
        <div
            className={bem.element('screen')}
        >
            <div className={bem.element('wrapper')}>
                <div className={bem.element('content')}>
                    {Object.entries(props.groupedMessagesByDates)
                        .map(([date, groupedMessages]) => (
                            <BubblesDateGroup
                                key={date}
                                date={date}
                                groupedMessages={groupedMessages}
                                currentUser={props.currentUser}
                            />
                        ))}
                </div>
            </div>
        </div>
    ), [bem, props.groupedMessagesByDates, props.currentUser]);

    return (
        <div className={bem.block()}>
            {renderChatScreen()}
            <ChatInputView
                chatId={props.chatId}
                onSendMessage={props.onSendMessage}
            />
        </div>
    );
}
