import * as React from 'react';
import Icon from '../../../../src/ui/content/Icon';
import {IModalViewProps} from '../../../../src/ui/modal/Modal/Modal';
import {Button} from '../../../../src/ui/form';
import useBem from '../../../../src/hooks/useBem';

function ModalMock(props: IModalViewProps) {
    return (
        <div className={props.className}>
            {props.children}
        </div>
    );
}

export default function ModalMockView(props: IModalViewProps) {
    const bem = useBem('ModalView');
    const overrideDefaultClasses = {
        base: bem.block('overlay'),
        afterOpen: 'ModalView_overlay-after',
        beforeClose: 'ModalView_overlay-before',
    };

    return (
        <ModalMock
            {...props}
            ariaHideApp={false}
            bodyOpenClassName='ModalView_body-hide-scroll'
            className={bem(bem.element('body', {size: props.size}), props.className)}
            closeTimeoutMS={props.closeTimeoutMs}
            isOpen={!props.isClosing}
            onRequestClose={props.onClose}
            overlayClassName={overrideDefaultClasses}
            shouldCloseOnEsc={props.shouldCloseOnEsc}
            shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
        >
            <div className={bem.element('header')}>
                <span className={bem.element('title')}>
                    {props.title}
                </span>
                <Icon
                    name='mockIcon'
                    className={bem.element('close')}
                    onClick={props.onClose}
                />
            </div>
            <div className={bem.element('content')}>
                {props.children}
            </div>
            {props.buttons && (
                <div className={bem.element('footer')}>
                    {props.buttons.map((button, buttonIndex) => (
                        <Button
                            key={buttonIndex}
                            size={props.size}
                            {...button}
                        />
                    ))}
                </div>
            )}
        </ModalMock>
    );
}
