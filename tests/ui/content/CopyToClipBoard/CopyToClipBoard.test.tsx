import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {act} from '@testing-library/react';

import CopyToClipBoardMockView from './CopyToClipBoardMockView';
import CopyToClipboard, {ICopyToClipboardProps} from '../../../../src/ui/content/CopyToClipboard/CopyToClipboard';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('CopyToClipBoard', () => {
    const expectedCopyToClipBoardClassName = 'CopyToClipBoardView';

    const props = {
        view: CopyToClipBoardMockView,
        value: 'test',
    } as ICopyToClipboardProps;

    const clipboardMock = {
        readText: jest.fn().mockImplementation(() => props.value),
        writeText: jest.fn(),
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(CopyToClipboard, props));
        const copyToClipboard = getElementByClassName(container, expectedCopyToClipBoardClassName);
        expect(copyToClipboard).toBeInTheDocument();
    });

    it('should be called and return value', async () => {
        Object.defineProperty(window, 'navigator', {
            value: {
                clipboard: clipboardMock,
            },
            configurable: true,
        });

        const {container} = render(JSXWrapper(CopyToClipboard, props));
        const copyToClipboardIcon = getElementByClassName(container, `${expectedCopyToClipBoardClassName}__icon`);

        await act(async () => {
            fireEvent.click(copyToClipboardIcon);
            expect(clipboardMock.writeText).toBeCalledWith(props.value);
            expect(clipboardMock.readText()).toBe(props.value);
        });
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(CopyToClipboard, {
            ...props,
            disabled: true,
        }));

        const copyToClipboard = getElementByClassName(container, expectedCopyToClipBoardClassName);
        expect(copyToClipboard).toHaveClass(`${expectedCopyToClipBoardClassName}_disabled`);
    });
});
