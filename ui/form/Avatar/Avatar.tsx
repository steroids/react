import * as React from 'react';
import {bem} from '@steroidsjs/core/hoc/bem';
import {IBemHocOutput} from '@steroidsjs/core/hoc/bem';

export interface IAvatarProps extends IBemHocOutput {
    avatarUrl?: string,
    title?: string,
    alt?: string,
    size?: 'large' | 'semi' | 'default' | 'small',
    enableLevelBorder?: boolean,
    enableDefaultBorder?: boolean,
    className?: string,
}

@bem('Avatar')
export default class Avatar extends React.PureComponent<IAvatarProps> {

    static defaultProps = {
        size: 'default',
        enableLevelBorder: 'true'
    };

    render() {
        const bem2 = useBem();
        const bem = this.props.bem;
        return (
            <img
                className={bem(
                    bem.block({
                        [this.props.size]: true,
                        'default-border': this.props.enableDefaultBorder,
                    }),
                    !this.props.enableDefaultBorder
                        && this.props.enableLevelBorder
                            && this.props.user
                                && `border-user-level-${this.props.user.level?.position}`,
                    this.props.className,
                )}
                src={this.props?.avatarUrl || this.props.user?.avatarUrl || '/images/avatar-stub.png'}
                title={this.props.user?.name || this.props.title || ''}
                alt={this.props.alt || ''}
            />
        );
    }
}