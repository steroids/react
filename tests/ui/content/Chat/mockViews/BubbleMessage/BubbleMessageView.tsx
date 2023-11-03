import * as React from 'react';
import {Avatar} from '../../../../../../src/ui/content/Avatar';
import {Text, Title} from '../../../../../../src/ui/typography';
import Icon from '../../../../../../src/ui/content/Icon';
import {IChatUser} from '../../../../../../src/ui/content/Chat/Chat';
import {useBem} from '../../../../../../src/hooks';

interface IBubbleMessageProps {
    user: IChatUser;
    text: string;
    timeAgo: string;
    isCurrentUser: boolean;
    isFirstMessage?: boolean;
    isLastMessage?: boolean;
}

function BubbleMessageView(props: IBubbleMessageProps) {
    const bem = useBem('BubbleMessageView');

    return (
        <div className={bem.block({
            'another-user': !props.isCurrentUser,
            'last-message': !!props.isLastMessage,
        })}
        >
            <div className={bem.element('user-message')}>
                {!props.isCurrentUser && props.isFirstMessage && (
                    <Title
                        className={bem.element('username')}
                        type='h4'
                        tag='h4'
                        content={`${props.user.firstName} ${props.user.lastName}`}
                    />
                )}
                <Text
                    className={bem.element('text')}
                    type="body"
                    content={props.text}
                />
                <div className={bem.element('indicators')}>
                    <Text
                        className={bem.element('time')}
                        type="body3"
                        content={props.timeAgo}
                    />
                    {props.isCurrentUser && (
                        <Icon
                            className={bem.element('check')}
                            name="mockIcon"
                        />
                    )}
                </div>
            </div>
            {props.user && (
                <div className={bem.element('avatar')}>
                    <Avatar
                        src={props.user.avatar?.src}
                        title={`${props.user.firstName} ${props.user.lastName}`}
                        status={props.user.avatar?.status}
                        size='sm'
                    />
                </div>
            )}
        </div>
    );
}

export default React.memo(BubbleMessageView);
