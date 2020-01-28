import React from 'react';
import {connect} from 'react-redux';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import { withReadme } from 'storybook-readme';

import Button from '../../form/Button';
import ModalWrapper from '../ModalWrapper';
import {openModal} from '../../../actions/modal';

import README from './README.md';

@connect()
class ButtonOpenModal extends React.Component {
    render() {
        return (
            <Button
                label='Open modal'
                onClick={() => this.props.dispatch(openModal(() => (
                    <div>
                        Any Component
                    </div>
                ), {
                    title: 'Modal title',
                }))}
            />
        );
    }
}

storiesOf('Modal', module)
    .addDecorator(withReadme(README))
    .add('Modal', context => (
        <div>
            <ModalWrapper/>
            {withInfo()(() => (
                <ButtonOpenModal/>
            ))(context)}
        </div>
    ));
