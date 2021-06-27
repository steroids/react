import * as React from 'react';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import useForm from '../../../hooks/useForm';
import {IFormProps} from '../../../ui/form/Form/Form';
import {formChange} from '../../../actions/form';

/**
 * SearchForm
 * Форма для поиска элементов в коллекции list-компонента.
 * Форма хранит значения в локальном состоянии, а на onSubmit отправляет их в хранилище Redux,
 * после чего в list-компонент подгружаются новые элементы коллекции.
 */
export interface ISearchFormProps extends IFormProps {
    listId?: string,
}

export default React.memo((props: ISearchFormProps): JSX.Element => {
    const {formId} = useForm();

    const dispatch = useDispatch();
    const onSubmit = useCallback((params) => {
        props.fields.forEach(field => {
            const attribute = typeof field === 'string' ? field : field.attribute;
            dispatch(formChange(formId, attribute, params?.[attribute] || null));
        });
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
