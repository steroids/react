import * as React from 'react';
import {INavProps} from '../../nav/Nav/Nav';
import fieldWrapper, {
    IFieldWrapperInputProps,
    IFieldWrapperOutputProps
} from '@steroidsjs/core/ui/form/Field/fieldWrapper';
import {useDataProvider} from '@steroidsjs/core/hooks';
import Nav from '../../nav/Nav/Nav';
import {useCallback} from 'react';
import {IDataProviderConfig} from '@steroidsjs/core/hooks/useDataProvider';
import {INavItem} from '../../nav/Nav/Nav';

/**
 * NavField
 * Навигация как часть формы
 */
export interface INavFieldProps extends IFieldWrapperInputProps, IFieldWrapperOutputProps, IDataProviderConfig {
    navProps: INavProps,
    [key: string]: any,
}

function NavField(props: INavFieldProps) {
    const {items} = useDataProvider({
        items: props.items,
    });

    const onChange = useCallback(value => props.input.onChange(value), [props.input.onChange]);

    return (
        <Nav
            {...props.navProps}
            items={items as INavItem[]}
            activeTab={props.input.value}
            onChange={onChange}
        />
    )
}

export default fieldWrapper('NavField', NavField);
