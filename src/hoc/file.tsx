import * as React from 'react';
import useFile from '../hooks/useFile';

/**
 * File HOC
 * Компонент для асинхронной загрузки файлов на сервер, используется в `FileField`
 */
export interface IFileHocInput {
    // TODO Remove unused props
    /*
      multiple: PropTypes.bool,
      uploader: PropTypes.object,
      backendUrl: PropTypes.string,
      mimeTypes: PropTypes.arrayOf(PropTypes.string),
      imagesOnly: PropTypes.bool,
      imagesProcessor: PropTypes.string,
      imagesExactSize: PropTypes.arrayOf(PropTypes.number),
      initialFiles: PropTypes.arrayOf(
        PropTypes.shape({
          uid: PropTypes.string,
          path: PropTypes.string,
          type: PropTypes.string,
          bytesTotal: PropTypes.number,
          bytesUploaded: PropTypes.number,
          bytesUploadEnd: PropTypes.number,
          resultHttpMessage: PropTypes.object
        })
      )
     */
    input?: FormInputType,
    multiple?: boolean;
    uploader?: any;
    backendUrl?: any;
    mimeTypes?: any;
    imagesOnly?: any;
    imagesProcessor?: any;
    imagesExactSize?: any;
    initialFiles?: any;
    uploaderConfig?: {
        useFormData?: boolean,
        fileFieldName?: string,
    }
}

export interface IFileHocOutput {
    uploader?: any;
    files?: any[];
    onBrowse?: any;
    onRemove?: any;
    onAdd?: any;
}

export default (): any => WrappedComponent => function FileHOC(props) {
    const fileProps = useFile(props);
    return (
        <WrappedComponent
            {...props}
            uploader={fileProps.uploader}
            files={fileProps.files}
            onBrowse={fileProps.onBrowse}
            onRemove={fileProps.onRemove}
        />
    );
};
