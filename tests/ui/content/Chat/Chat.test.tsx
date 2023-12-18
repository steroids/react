import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';
import {Chat} from '../../../../src/ui/content';
import {calculateMessageTimeAgo} from '../../../../src/ui/content/Chat/utils';

describe('Chat tests', () => {
    const expectedChatClass = 'ChatView';
    const expectedMessageClass = 'BubbleMessageView';
    const expectedChatInputClass = 'ChatInputView';

    const messages = [
        {
            id: 1,
            text: 'Всем привет!',
            user: {
                id: 1,
                firstName: 'Sophia',
                lastName: 'Miller',
                avatar: {
                    src: 'https://i.ibb.co/xjkhs5Q/image.png',
                    status: true,
                },
            },
            timestamp: '2023-10-25T12:38:00',
        },
        {
            id: 2,
            text: 'Привет!',
            user: {
                id: 1,
                firstName: 'Sophia',
                lastName: 'Miller',
                avatar: {
                    src: 'https://i.ibb.co/xjkhs5Q/image.png',
                    status: true,
                },
            },
            timestamp: '2023-10-25T16:38:00',
        },
    ];

    const currentUser = {
        id: 1,
        firstName: 'Sophia',
        lastName: 'Miller',
        avatar: {
            src: 'https://i.ibb.co/xjkhs5Q/image.png',
            status: true,
        },
    };

    const props = {
        chatId: 'Chat',
        messages,
        currentUser,
    };

    it('should render Chat', () => {
        const {container} = render(JSXWrapper(Chat, props));

        window.scrollTo = jest.fn();

        const chat = getElementByClassName(container, expectedChatClass);

        expect(chat).toBeInTheDocument();
    });

    it('should render messages', () => {
        const {container} = render(JSXWrapper(Chat, props));

        const messagesElements = container.querySelectorAll(`.${expectedMessageClass}`);

        expect(messagesElements.length).toEqual(messages.length);
    });

    it('should render message data', () => {
        const expectedMessageText = messages[0].text;
        const expectedMessageDate = calculateMessageTimeAgo(messages[0].timestamp);

        const {queryByText} = render(JSXWrapper(Chat, props));

        expect(queryByText(expectedMessageText)).toBeInTheDocument();
        expect(queryByText(expectedMessageDate)).toBeInTheDocument();
    });

    it('should send a new message', () => {
        const expectedMessageText = 'Message';
        const expectedMessageTime = '0 мин. назад';
        const expectedSendMessageButtonIndex = 1;

        const {container, queryByText, getByRole, getByDisplayValue} = render(JSXWrapper(Chat, props));

        const chatInputElement = getElementByClassName(container, expectedChatInputClass) as HTMLElement;

        const chatInput = getByRole('textbox');
        const sendMessageButton = getElementByTag(chatInputElement, 'button', expectedSendMessageButtonIndex);

        fireEvent.change(chatInput, {target: {value: expectedMessageText}});

        expect(getByDisplayValue(expectedMessageText)).toBeInTheDocument();

        fireEvent.click(sendMessageButton);

        expect(queryByText(expectedMessageTime)).toBeInTheDocument();
    });
});
