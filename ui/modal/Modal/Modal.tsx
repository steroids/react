import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {IControlItem} from '../../nav/Controls/Controls';

export interface IModalProps {
    index?: number,
    onClose?: (...args: any[]) => any;
    title?: string,
    size?: Size,
    view?: any;
    className?: CssClassName;
    isClosing?: boolean;
    group?: string;
    component?: any;
    componentProps?: any;
    controls?: IControlItem[],
    [key: string]: any,
}

export interface IModalViewProps extends IModalProps {
    isClosing?: boolean,
}

interface IModalPrivateProps extends IComponentsHocOutput {

}

@components('ui')
export default class Modal extends React.PureComponent<IModalProps & IModalPrivateProps> {

    static defaultProps = {
        size: 'md',
    };

    render() {
        const ModalView = this.props.view || this.props.ui.getView('modal.ModalView');
        const ContentComponent = this.props.component;
        const {componentProps, ...props} = this.props;

        return (
            <ModalView {...this.props}>
                {ContentComponent && (
                    <ContentComponent
                        {...props}
                        {...componentProps}
                    />
                ) || (
                    this.props.children
                )}
            </ModalView>
        );
    }

}
