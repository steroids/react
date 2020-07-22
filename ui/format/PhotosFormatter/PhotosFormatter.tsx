import * as React from 'react';
import {IComponentsHocOutput} from '../../../hoc/components';
import {components} from "../../../hoc";

export interface IMoneyFormatterProps {
    value?: {
        uid?: number,
        src?: string,
        thumbnail?: string,
        thumbnailWidth?: number,
        thumbnailHeight?: number
    }[];
    photoRowHeight?: number;
    videoRowHeight?: number;
    view?: CustomView;
}

@components('ui')
export default class PhotosFormatter extends React.Component<IMoneyFormatterProps & IComponentsHocOutput> {

    static defaultProps = {
        photoRowHeight: 120
    };

    render() {
        // TODO react-grid-gallery library now is not supported! We need implement our gallery with blackjack and hookers 8<)
        const photos = this.props.value;
        if (!photos || photos.length === 0) {
        return null;
        }

        const PhotoFormatterView = this.props.view || this.props.ui.getView('format.PhotosFormatterView');
        return <PhotoFormatterView
            value={photos}
            photoRowHeight={this.props.photoRowHeight}
        />;
    }

}
