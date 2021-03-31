import * as React from 'react';
import {useCallback} from 'react';
import useForm from '@steroidsjs/core/hooks/useForm';
import {useDispatch} from 'react-redux';
import {listFetch} from '@steroidsjs/core/actions/list';
import {IFormProps} from '@steroidsjs/core/ui/form/Form/Form';

interface ISearchFormProps extends IFormProps {
    listId?: string,
}

export default React.memo((props: ISearchFormProps) => {
    const {formId} = useForm();

    const dispatch = useDispatch();
    const onSubmit = useCallback((params) => {
        dispatch(listFetch(props.listId, params));
    }, [dispatch, props.listId]);

    if (!props.fields || props.layout === 'table') {
        return null;
    }

    const Form = require('../../form/Form').default;
    return (
        <Form
            submitLabel={__('Найти')}
            {...props}
            formId={formId}
            addressBar={false}
            onSubmit={onSubmit}
        />
    );
});
