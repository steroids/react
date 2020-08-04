import * as React from 'react';
import {IComponentsHocOutput} from '../../../hoc/components';
import {components} from "../../../hoc";

export interface IPhotosFormatterProps {
    value?: {
        /**
         * Уникальный текстовый идентификатор
         * @example e65f5867-0083-48a7-af43-1121ed9e6280
         */
        uid?: number,
        src?: string,

        /**
         * Url thumbnail картинки
         * @example assets/apple.thumbnail.png
         */
        thumbnail?: string,

        /**
         * Ширина thumbnail картинки
         * @example 1920
         */
        thumbnailWidth?: number,

        /**
         * Высота thumbnail картинки
         * @example 1080
         */
        thumbnailHeight?: number
    }[];
    photoRowHeight?: number;
    videoRowHeight?: number;
    view?: CustomView;
}

@components('ui')
export default class PhotosFormatter extends React.Component<IPhotosFormatterProps & IComponentsHocOutput> {

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
