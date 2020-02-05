import * as React from 'react';
import Gallery from 'react-grid-gallery';
import {formatter} from '../../../hoc';
import {IFormatterHocInput, IFormatterHocOutput} from '../../../hoc/formatter';

interface IMoneyFormatterProps extends IFormatterHocInput {
    value?: {
        uid?: number,
        src?: string,
        thumbnail?: string,
        thumbnailWidth?: number,
        thumbnailHeight?: number
    }[];
    photoRowHeight?: number;
    videoRowHeight?: number;
}

interface IMoneyFormatterPrivateProps extends IFormatterHocOutput {

}

@formatter()
export default class PhotosFormatter extends React.Component<IMoneyFormatterProps & IMoneyFormatterPrivateProps> {

    static defaultProps = {
        photoRowHeight: 120
    };

    render() {
        const photos = this.props.value;
        if (!photos || photos.length === 0) {
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
