import * as React from 'react';
import {field} from '../../../hoc';
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import Nav, {INavProps} from '../../nav/Nav/Nav';
import dataProvider, {IDataProviderHocOutput} from '../../../hoc/dataProvider';

/**
 * NavField
 * Навигация как часть формы
 */
export interface INavFieldProps extends IFieldHocInput {
    navProps: INavProps,

}

interface INavFieldPrivateProps extends IFieldHocOutput, IDataProviderHocOutput {

}

@field({
    componentId: 'form.NavField'
})
@dataProvider()
export default class NavField extends React.PureComponent<INavFieldProps & INavFieldPrivateProps> {
    render() {
        return (
            <Nav
                {...this.props.navProps}
                items={this.props.items}
                activeTab={this.props.input.value}
                onChange={value => this.props.input.onChange(value)}
            />
        );
    }
}
