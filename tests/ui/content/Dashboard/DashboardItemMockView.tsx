import {useBem} from '../../../../src/hooks';
import {IDashboardItemViewProps} from '../../../../src/ui/content/Dashboard/Dashboard';
import {Title} from '../../../../src/ui/typography';
import {Icon} from '../../../../src/ui/content';

export default function DashboardItemView(props: IDashboardItemViewProps) {
    const bem = useBem('DashboardItemView');

    return (
        <div className={bem.block()}>
            <div className={bem.element('header')}>
                {props.iconName && <Icon name={props.iconName} /> }
                <Title
                    content={props.title}
                    type='h3'
                />
            </div>
            {props.children}
        </div>
    );
}
