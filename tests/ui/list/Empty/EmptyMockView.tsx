import {IEmptyViewProps} from '../../../../src/ui/list/Empty/Empty';
import {useBem} from '../../../../src/hooks';

export default function EmptyView(props: IEmptyViewProps) {
    const bem = useBem('EmptyView');
    return (
        <div
            className={bem(
                bem.block(),
                props.className,
            )}
            style={props.style}
        >
            {props.text}
        </div>
    );
}
