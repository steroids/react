import * as React from 'react';
import {IFieldHocInput} from '../../../hoc/field';
import Nav, {INavProps} from '../../nav/Nav/Nav';
import dataProvider from '../../../hoc/dataProvider';
import {fieldWrapper, IFieldWrapperProps} from '../../../hooks/form';

/**
 * NavField
 * Навигация как часть формы
 */
export interface INavFieldProps extends IFieldHocInput {
    navProps: INavProps,
    [key: string]: any,
}

function NavField(props: INavFieldProps & IFieldWrapperProps) {
    return (
        <Nav
            {...props.navProps}
            items={props.items}
            activeTab={props.input.value}
            onChange={value => props.input.onChange(value)}
        />
    );
}

export default dataProvider()(fieldWrapper('NavField')(NavField));
