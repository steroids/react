import {IIconViewProps} from '../../../../src/ui/content/Icon/Icon';
import {useBem} from '../../../../src/hooks';

export default function IconView(props: IIconViewProps) {
    const bem = useBem('IconView');
    if (typeof props.icon === 'string' && props.icon.indexOf('<svg') === 0) {
        return (
            <span
                dangerouslySetInnerHTML={{__html: props.icon} /* eslint-disable-line react/no-danger */}
                aria-label={props.title}
                title={props.title}
                className={bem(bem.block(), props.className)}
                onClick={props.onClick}
                onKeyPress={props.onClick}
                role='button'
                tabIndex={0}
            />
        );
    }

    return (
        <span
            onClick={props.onClick}
            onKeyPress={props.onClick}
            role='button'
            tabIndex={0}
        >
            <img
                alt={props.title}
                title={props.title}
                src={props.icon}
                className={bem(bem.block(), props.className)}
            />
        </span>
    );
}
