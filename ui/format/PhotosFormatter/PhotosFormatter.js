import React from 'react';
import PropTypes from 'prop-types';
import Gallery from 'react-grid-gallery';
import _get from 'lodash-es/get';

import viewHoc from '../viewHoc';

export default
@viewHoc()
class PhotosFormatter extends React.Component {

    static propTypes = {
        attribute: PropTypes.string,
        item: PropTypes.object,
        photos: PropTypes.arrayOf(PropTypes.shape({
            uid: PropTypes.number,
            src: PropTypes.string,
            thumbnail: PropTypes.string,
            thumbnailWidth: PropTypes.number,
            thumbnailHeight: PropTypes.number,
        })),
        photoRowHeight: PropTypes.number,
        videoRowHeight: PropTypes.number,
    };

    static defaultProps = {
        photoRowHeight: 120,
    };

    render() {
        const photos = this.props.photos || _get(this.props.item, this.props.attribute) || [];
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
