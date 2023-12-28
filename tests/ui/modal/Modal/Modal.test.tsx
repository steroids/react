import '@testing-library/jest-dom';
import * as React from 'react';
import {fireEvent} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';
import {JSXWrapper, getElementByClassName, render} from '../../../helpers';
import Modal, {IModalProps} from '../../../../src/ui/modal/Modal/Modal';
import {useDispatch} from '../../../../src/hooks';
import {Button} from '../../../../src/ui/form';
import {openModal} from '../../../../src/actions/modal';

const componentText = 'Modal Component Text';
const buttonText = 'Open modal';

const props = {
    component: () => <div>{componentText}</div>,
    className: 'testClass',
    closeTimeoutMs: 0,
    onClose: jest.fn(),
} as IModalProps;

interface IModalButtonProps extends IModalProps{
    modalChildren: JSX.Element,
}

export function ModalButton(modalButtonProps: IModalButtonProps) {
    const dispatch = useDispatch();
    return (
        <Button
            label={buttonText}
            onClick={e => {
                e.preventDefault();
                dispatch(openModal(modalButtonProps?.modalChildren || Modal, {
                    modalId: 'demoModal',
                    ...modalButtonProps,
                }));
            }}
        />
    );
}

describe('Modal tests', () => {
    const expectedModalClassName = 'ModalView__body';
    const expectedModalCloseClassName = 'ModalView__close';

    const renderComponent = (customProps?: any) => {
        const modalProps = {
            ...props,
            ...customProps,
        };

        const {
            container,
            getByText,
            queryByText,
        } = render(JSXWrapper(ModalButton, modalProps, true, true),
            {
                container: document.body,
            });

        const openModalButton = getByText(buttonText);
        fireEvent.click(openModalButton);

        const modal = getElementByClassName(container, expectedModalClassName);
        expect(modal).toBeInTheDocument();

        return {
            container,
            getByText,
            queryByText,
            openModalButton,
        };
    };

    beforeAll(() => {
        //Workaround with directly dom rendering in document.body
        global.console.error = jest.fn();
    });

    it('should render into Portal by button click and have className', () => {
        const {
            container,
            getByText,
        } = renderComponent();

        const modal = getElementByClassName(container, expectedModalClassName);

        expect(modal).toBeInTheDocument();
        expect(modal).toHaveClass(props.className);
        expect(getByText(componentText)).toBeInTheDocument();
    });

    it('should close modal on a close button click', async () => {
        const expectedOnCloseClickCount = 1;

        const {
            container,
            queryByText,
        } = renderComponent();

        const closeModalButton = getElementByClassName(container, expectedModalCloseClassName);
        fireEvent.click(closeModalButton);

        expect(props.onClose).toHaveBeenCalledTimes(expectedOnCloseClickCount);
        expect(queryByText(componentText)).not.toBeInTheDocument();
    });

    it('should render children prop correctly when component prop is not passed', () => {
        const modalChildrenText = 'Test Children';

        const ModalChildren = (modalChildrenProps) => (
            <Modal {...modalChildrenProps}>
                <div>{modalChildrenText}</div>
            </Modal>
        );

        const localProps = {
            component: null,
            modalChildren: ModalChildren,
        } as IModalProps;

        const {
            getByText,
        } = renderComponent(localProps);

        expect(getByText(modalChildrenText)).toBeInTheDocument();
    });

    it('should render component prop', () => {
        const modalComponentText = 'Test Component';

        const localProps = {
            component: () => <div>{modalComponentText}</div>,
        } as IModalProps;

        const {
            getByText,
        } = renderComponent(localProps);

        expect(getByText(modalComponentText)).toBeInTheDocument();
    });

    it('should call onClose after timeout', async () => {
        const expectedOnCloseClickCount = 1;

        const localProps = {
            closeTimeoutMs: 100,
            onClose: jest.fn(),
        } as IModalProps;

        const {container} = renderComponent(localProps);

        const closeModalButton = getElementByClassName(container, expectedModalCloseClassName);
        fireEvent.click(closeModalButton);

        await waitFor(() => expect(localProps.onClose)
            .toHaveBeenCalledTimes(expectedOnCloseClickCount),
        {timeout: localProps.closeTimeoutMs});
    });

    it('should close modal automatically', async () => {
        const expectedOnCloseClickCount = 1;

        const localProps = {
            closeAfterMs: 10,
            closeTimeoutMs: 10,
            onClose: jest.fn(),
        } as IModalProps;

        const {queryByText} = renderComponent(localProps);

        await waitFor(() => {
            expect(localProps.onClose).toHaveBeenCalledTimes(expectedOnCloseClickCount);
        },
        {timeout: props.closeAfterMs});

        await waitFor(() => {
            expect(queryByText(componentText)).not.toBeInTheDocument();
        },
        {timeout: props.closeAfterMs + props.closeTimeoutMs});
    });

    it('should render title from props', async () => {
        const expectedTitle = 'Modal Title';
        const localProps = {
            title: expectedTitle,
        } as IModalProps;

        const {getByText} = renderComponent(localProps);

        expect(getByText(expectedTitle)).toBeInTheDocument();
    });

    it('should render footer buttons', async () => {
        const onCloseProp = jest.fn();
        const localProps = {
            onClose: onCloseProp,
            component: null,
            buttons: [
                {
                    label: 'Alert',
                    onClick: () => alert('This is alert!'),
                    outline: true,
                },
                {
                    label: 'Close',
                    onClick: () => onCloseProp(),
                },
            ],
        } as IModalProps;

        const {queryByText, getByText} = renderComponent(localProps);

        const closeModalButton = getByText('Close');
        const alertModalButton = getByText('Alert');

        expect(alertModalButton).toBeInTheDocument();
        expect(closeModalButton).toBeInTheDocument();

        fireEvent.click(closeModalButton);

        expect(onCloseProp).toHaveBeenCalledTimes(1);
        expect(queryByText(componentText)).not.toBeInTheDocument();
    });
});
