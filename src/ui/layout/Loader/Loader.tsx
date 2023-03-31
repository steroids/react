import {useComponents} from '../../../hooks';

export interface ILoaderProps {
    view?: CustomView;
    [key: string]: any;
}

export default function Loader(props: ILoaderProps): JSX.Element {
    return useComponents().ui.renderView(props.view || 'layout.LoaderView', props);
}
