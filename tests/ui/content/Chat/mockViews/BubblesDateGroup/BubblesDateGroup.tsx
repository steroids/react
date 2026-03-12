import * as React from 'react';

import {useBem} from '../../../../../../src/hooks';
import {IChatUser} from '../../../../../../src/ui/content/Chat/Chat';
import {IGroupedMessage} from '../../../../../../src/ui/content/Chat/hooks/useChat';
import {calculateMessageTimeAgo} from '../../../../../../src/ui/content/Chat/utils';
import BubbleMessageView from '../BubbleMessage';

interface IBubblesDateGroupProps {
    date: string,
    groupedMessages: IGroupedMessage[][],
    currentUser: IChatUser,
}

function BubblesDateGroup(props: IBubblesDateGroupProps) {
    const bem = useBem('BubblesDateGroup');

    const toBubbles = React.useCallback((groupedMessages, index) => (
        <div
            className={bem.element('bubbles')}
            key={index}
        >
            {groupedMessages.map((bubbleMessage) => (
                <BubbleMessageView
                    key={bubbleMessage.id}
                    user={bubbleMessage.user}
                    text={bubbleMessage.text}
                    timeAgo={calculateMessageTimeAgo(bubbleMessage.timestamp)}
                    isCurrentUser={bubbleMessage.user.id === props.currentUser.id}
                    isFirstMessage={bubbleMessage.isFirstMessage}
                    isLastMessage={bubbleMessage.isLastMessage}
                />
            ))}
        </div>
    ), [bem, props.currentUser.id]);

    const renderDate = React.useCallback(() => (
        <>
            <div className={bem.element('date')}>
                <div className={bem.element('date-wrapper')}>
                    <span className={bem.element('date-text')}>
                        {props.date}
                    </span>
                </div>
            </div>
            <div className={bem.element('date', 'invisible-date')}>
                <div className={bem.element('date-wrapper', 'invisible-date')}>
                    {props.date}
                </div>
            </div>
        </>
    ), [bem, props.date]);

    return (
        <div className={bem.block()}>
            {renderDate()}
            {props.groupedMessages?.map(toBubbles)}
        </div>
    );
}

export default React.memo(BubblesDateGroup);
