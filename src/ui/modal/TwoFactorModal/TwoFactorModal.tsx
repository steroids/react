import React from 'react';
import useComponents from '../../../hooks/useComponents';
import useFetch from '../../../hooks/useFetch';
import Modal from '../Modal';

interface ITwoFactorModalProps extends IUiComponent {
    /**
    * Имя провайдера
    */
    providerName: string,

    /**
    * Функция, которая вызывается при закрытии модального окна
    */
    onClose?: any,
}

interface ITwoFactorModalPrivateProps extends ITwoFactorModalProps {
    info?: {
        providerName: string,
        providerData: any,
        createTime: string,
        expireTime: string,
        isConfirmed: string,
    },
}

/**
 * Компонент TwoFactorModal отображает модальное окно для двухфакторной аутентификации.
 **/
export interface ITwoFactorModalViewProps extends ITwoFactorModalPrivateProps {
    description?: string,
    formProps?: any,
    [key: string]: any,
}

interface ITwoFactorResponse {
    providerData?: {
        type: string,
        value: string,
    },
    type?: string,
    [key: string]: unknown,
}

export default function TwoFactorModal(props: ITwoFactorModalProps): JSX.Element {
    const components = useComponents();

    const {data} = useFetch<ITwoFactorResponse>({
        method: 'post',
        url: `/api/v1/auth/2fa/${props.providerName}/send`,
    });

    if(!data || 'statusCode' in data ){
        return null;
    }

    const providerData = data.providerData;

    const getDescription = () => {
        switch (props.providerName) {
            case 'notifier':
                if (providerData?.type === 'phone') {
                    return __('Вам отправлен СМС код на номер {phone}, введите его в поле ниже', {
                        phone: providerData?.value,
                    });
                }
                if (providerData?.type === 'email') {
                    return __('Вам отправлен код на почту {email}, введите его в поле ниже', {
                        email: providerData?.value,
                    });
                }
                return __('Для подтверждения операции вам отправлен код');

            case 'google':
                return __('Введите код подтверждения из мобильного приложения Google Authenticator');

            default: return __('Введите код для подтверждения операции');
        }
    };

    const TwoFactorModalView = props.view || components.ui.getView('modal.TwoFactorModalView');

    return (
        <Modal
            {...props}
            onClose={props.onClose}
        >
            <TwoFactorModalView
                {...props}
                formProps={{
                    formId: 'TwoFactorModal',
                    action: `/api/v1/auth/2fa/${props.providerName}/confirm`,
                    onComplete: () => props.onClose(),
                }}
                description={getDescription()}
            />
        </Modal>
    );
}
