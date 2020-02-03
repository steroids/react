import * as React from 'react';
import Gallery from 'react-grid-gallery';
import _get from 'lodash-es/get';
import viewHoc from '../viewHoc';

interface IPhotosFormatterProps {
    attribute?: string;
    item?: any;
    photos?: {
        uid?: number,
        src?: string,
        thumbnail?: string,
        thumbnailWidth?: number,
        thumbnailHeight?: number
    }[];
    photoRowHeight?: number;
    videoRowHeight?: number;
}

@viewHoc()
export default class PhotosFormatter extends React.Component<IPhotosFormatterProps,
    {}> {
    static defaultProps = {
        photoRowHeight: 120
    };

    render() {
        const photos =
            this.props.photos || _get(this.props.item, this.props.attribute) || [];
        if (photos.length === 0) {
            return null;
        }
        return (
            <Gallery
                images={photos}
                margin={3}
                rowHeight={this.props.photoRowHeight}
                backdropClosesModal={true}
                enableImageSelection={false}
                imageCountSeparator={__(' из ')}
            />
        );
    }
}
