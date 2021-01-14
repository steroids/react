import React from 'react';
import {components, fetch} from '../../../hoc';
import Modal from '../Modal';

import {IComponentsHocOutput} from '../../../hoc/components';
import {IFetchHocOutput} from '../../../hoc/fetch';

interface ITwoFactorModalProps {
    providerName: string,
    view?: any;
}

interface ITwoFactorModalPrivateProps extends ITwoFactorModalProps, IFetchHocOutput, IComponentsHocOutput {
    onClose?: any,
    info?: {
        providerName: string,
        providerData: any,
        createTime: string,
        expireTime: string,
        isConfirmed: string,
    },
}

export interface ITwoFactorModalViewProps extends ITwoFactorModalPrivateProps {
    description?: string,
    formProps?: any,
    [key: string]: any,
}

@fetch(({providerName}) => ({
    method: 'post',
    url: `/api/v1/auth/2fa/${providerName}/send`,
    key: 'info',
}))
@components('ui')
export default class TwoFactorModal extends React.PureComponent<ITwoFactorModalViewProps & ITwoFactorModalPrivateProps> {

    render() {
        const TwoFactorModalView = this.props.view || this.props.ui.getView('modal.TwoFactorModalView');
        return (
            <Modal
                {...this.props}
                onClose={this.props.onClose}
            >
                <TwoFactorModalView
                    {...this.props}
                    formProps={{
                        formId: 'TwoFactorModal',
                        action: `/api/v1/auth/2fa/${this.props.providerName}/confirm`,
                        onComplete: () => this.props.onClose()
                    }}
                    description={this.getDescription()}
                />
            </Modal>
        );
    }

    getDescription() {
        switch (this.props.providerName) {
            case 'notifier':
                if (this.props.info.providerData?.type === 'phone') {
                    return __('Вам отправлен СМС код на номер {phone}, введите его в поле ниже', {
                        phone: this.props.info.providerData?.value,
                    });
                }
                if (this.props.info.providerData?.type === 'email') {
                    return __('Вам отправлен код на почту {email}, введите его в поле ниже', {
                        email: this.props.info.providerData?.value,
                    });
                }
                return __('Для подтверждения операции вам отправлен код');

            case 'google':
                return __('Введите код подтверждения из мобильного приложения Google Authenticator');

        }

        return __('Введите код для подтверждения операции');
    }
}
