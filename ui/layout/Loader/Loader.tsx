import {useComponents} from '@steroidsjs/core/hooks';

export interface ILoaderProps {
    view?: any;
    [key: string]: any;
}

export default function Loader(props: ILoaderProps) {
    return useComponents().ui.renderView(props.view || 'layout.LoaderView', props);
}
