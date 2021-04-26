import * as React from 'react';
import {showNotification} from '../../../actions/notifications';
import Form from '../../form/Form/Form';
import {getCrudFormId, ICrudChildrenProps} from './Crud';

export default function CrudForm(props: ICrudChildrenProps) {
    return (
        <Form
            formId={getCrudFormId(props)}
            action={[props.restUrl, props.itemId].filter(Boolean).join('/')}
            model={props.model}
            autoFocus
            submitLabel={props.itemId ? __('Сохранить') : __('Добавить')}
            layout='horizontal'
            onComplete={() => {
                window.scrollTo(0, 0);
                props.dispatch(showNotification(__('Запись успешно обновлена.')));

                if (props.onComplete) {
                    props.onComplete();
                }
            }}
            {...props.form}
            initialValues={{
                ...props.form.initialValues,
                ...props.item,
            }}
        />
    );
}
