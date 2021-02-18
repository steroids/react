import * as React from 'react';
import { useMemo } from 'react';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import Nav, {INavProps} from '../../nav/Nav/Nav';
import dataProvider, {IDataProviderHocOutput} from '../../../hoc/dataProvider';
import useField, { defineField } from '../../../hooks/field';

/**
 * NavField
 * Навигация как часть формы
 */
export interface INavFieldProps extends IFieldHocInput {
    navProps: INavProps,
    [key: string]: any,
}

interface INavFieldPrivateProps extends IFieldHocOutput, IDataProviderHocOutput {

}

function NavField(props: INavFieldProps & INavFieldPrivateProps) {
    props = useField('NavField', props);

    props.navProps = useMemo(() => ({
        ...props.navProps,
    }), [props.navProps, props.items, props.input]);
    return (
        <Nav
            {...props.navProps}
            items={props.items}
            activeTab={props.input.value}
            onChange={value => props.input.onChange(value)}
        />
    );
}

export default dataProvider()(defineField('NavField')(NavField));
