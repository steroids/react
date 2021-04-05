import * as React from 'react';
import {useCallback} from 'react';
import useForm from '@steroidsjs/core/hooks/useForm';
import {useDispatch} from 'react-redux';
import {IFormProps} from '@steroidsjs/core/ui/form/Form/Form';
import {formChange} from '@steroidsjs/core/actions/form';

interface ISearchFormProps extends IFormProps {
    listId?: string,
}

export default React.memo((props: ISearchFormProps) => {
    const {formId} = useForm();

    const dispatch = useDispatch();
    const onSubmit = useCallback((params) => {
        console.log('submit')
        props.fields.forEach(field => {
            const attribute = typeof field === 'string' ? field : field.attribute;
            dispatch(formChange(formId, attribute, params?.[attribute] || null));
        })
    }, [dispatch, formId, props.fields]);

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
