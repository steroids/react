import * as React from 'react';
import {showNotification} from '../../../actions/notifications';
import Form from '../../form/Form/Form';
import {IConnectHocOutput} from '../../../hoc/connect';
import {getCrudFormId, ICrudChildrenProps} from './Crud';
import {connect, fetch} from '../../../hoc';

@connect()
@fetch(props => props.itemId && ({
    url: `${props.restUrl}/${props.itemId}`,
    key: 'item',
}))
export default class CrudForm extends React.PureComponent<ICrudChildrenProps & IConnectHocOutput> {

    render() {
        return (
            <Form
                formId={getCrudFormId(this.props)}
                action={[this.props.restUrl, this.props.itemId].filter(Boolean).join('/')}
                model={this.props.model}
                autoFocus
                submitLabel={this.props.itemId ? __('Сохранить') : __('Добавить')}
                initialValues={this.props.item}
                layout='horizontal'
                onComplete={() => {
                    window.scrollTo(0, 0);
                    this.props.dispatch(
                        showNotification('success', __('Запись успешно обновлена.'))
                    );
                }}
                {...this.props.form}
            />
        );
    }
}
