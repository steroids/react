import * as React from 'react';
import _get from 'lodash-es/get';
import _pick from 'lodash-es/pick';
import _isEqual from 'lodash-es/isEqual';
import _merge from 'lodash-es/merge';
import _difference from 'lodash-es/difference';
import FileUp from 'fileup-core';
import File from 'fileup-core/lib/models/File';
import QueueCollection from 'fileup-core/lib/models/QueueCollection';
import buildURL from 'axios/lib/helpers/buildURL';

export interface IFileHocInput {
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
    input: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    },
    multiple?: boolean;
    uploader?: any;
    backendUrl?: any;
    mimeTypes?: any;
    imagesOnly?: any;
    imagesProcessor?: any;
    imagesExactSize?: any;
    initialFiles?: any;
}

export interface IFileHocOutput {
    /*

        uploader={this._uploader}
        files={[].concat(this._uploader.queue.getFiles())}
        onBrowse={this._onBrowse}
        onRemove={this._onRemove}
     */
    uploader?: any;
    files?: any[];
    onBrowse?: any;
    onRemove?: any;
}

export default (): any => WrappedComponent =>
    class FileHoc extends React.PureComponent<IFileHocInput> {
        _uploader: any;
        forceUpdate: any;
        static WrappedComponent = WrappedComponent;
        /**
         * Proxy real name, prop types and default props for storybook
         */
        static displayName = WrappedComponent.displayName || WrappedComponent.name;
        static propTypes = {
            ...WrappedComponent.propTypes,
        };
        static defaultProps = {
            ...WrappedComponent.defaultProps,
            multiple: false
        };
        static imagesMimeTypes = [
            'image/gif',
            'image/jpeg',
            'image/pjpeg',
            'image/png'
        ];

        static generateBackendUrl(props) {
            return buildURL(props.backendUrl, {
                mimeTypes: props.imagesOnly ? FileHoc.imagesMimeTypes : props.mimeTypes,
                imagesProcessor: props.imagesProcessor,
                imagesExactSize: props.imagesExactSize
            });
        }

        constructor(props) {
            super(props);
            this._onQueueUpdate = this._onQueueUpdate.bind(this);
            this._onQueueItemEnd = this._onQueueItemEnd.bind(this);
            this._onQueueRemove = this._onQueueRemove.bind(this);
            this._onBrowse = this._onBrowse.bind(this);
            this._onRemove = this._onRemove.bind(this);
            this._uploader = new FileUp({
                dropArea: {},
                backendUrl: FileHoc.generateBackendUrl(this.props),
                ...this.props.uploader,
                form: {
                    ...(this.props.uploader && this.props.uploader.form),
                    multiple: this.props.multiple
                }
            });
            // Add uploaded files
            if (this.props.initialFiles) {
                this.initFiles(this.props.initialFiles);
            }
        }

        initFiles(items) {
            this._uploader.queue.add(
                items.map(
                    item =>
                        new File({
                            status: File.STATUS_END,
                            result: File.RESULT_SUCCESS,
                            resultHttpStatus: 200,
                            ...item
                        })
                )
            );
        }

        componentDidMount() {
            this._uploader.queue.on(
                QueueCollection.EVENT_ITEM_STATUS,
                this._onQueueUpdate
            );
            this._uploader.queue.on(
                QueueCollection.EVENT_ITEM_PROGRESS,
                this._onQueueUpdate
            );
            this._uploader.queue.on(
                QueueCollection.EVENT_ITEM_END,
                this._onQueueItemEnd
            );
            this._uploader.queue.on(
                QueueCollection.EVENT_REMOVE,
                this._onQueueRemove
            );
        }

        componentWillUnmount() {
            this._uploader.queue.off(
                QueueCollection.EVENT_ITEM_STATUS,
                this._onQueueUpdate
            );
            this._uploader.queue.off(
                QueueCollection.EVENT_ITEM_PROGRESS,
                this._onQueueUpdate
            );
            this._uploader.queue.off(
                QueueCollection.EVENT_ITEM_END,
                this._onQueueItemEnd
            );
            this._uploader.queue.off(
                QueueCollection.EVENT_REMOVE,
                this._onQueueRemove
            );
        }

        UNSAFE_componentWillReceiveProps(nextProps) {
            // Check backend url changes
            const urlPropKeys = [
                'backendUrl',
                'mimeTypes',
                'imagesOnly',
                'imagesProcessor',
                'imagesExactSize'
            ];
            if (
                !_isEqual(_pick(this.props, urlPropKeys), _pick(nextProps, urlPropKeys))
            ) {
                this._uploader.backendUrl = FileHoc.generateBackendUrl(nextProps);
            }
            // Check multiple flag update
            if (this.props.multiple !== nextProps.multiple) {
                this._uploader.form.multiple = nextProps.multiple;
            }
            // Check uploader config update
            if (!_isEqual(this.props.uploader, nextProps.uploader)) {
                _merge(this._uploader, nextProps.uploader);
            }
            // Check remove keys from value
            if (!_isEqual(this.props.input.value, nextProps.input.value)) {
                const toRemove = _difference(
                    [].concat(this.props.input.value || []),
                    [].concat(nextProps.input.value || [])
                );
                if (toRemove.length > 0) {
                    this._uploader.queue.remove(
                        this._uploader.queue.getFiles().filter(file => {
                            return (
                                toRemove.indexOf(_get(file.getResultHttpMessage(), 'id')) !== -1
                            );
                        })
                    );
                }
            }
            // Check set initial files
            if (!this.props.initialFiles && nextProps.initialFiles) {
                this.initFiles(nextProps.initialFiles);
            }
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    uploader={this._uploader}
                    files={[].concat(this._uploader.queue.getFiles())}
                    onBrowse={this._onBrowse}
                    onRemove={this._onRemove}
                />
            );
        }

        /**
         * Triggered by queue when file status or progress updated
         * @private
         */
        _onQueueUpdate() {
            this.forceUpdate();
        }

        /**
         * Trigger by queue when file is uploaded or error
         * @param {File} file
         * @private
         */
        _onQueueItemEnd(file) {
            // Check successfully
            if (file.getResult() !== File.RESULT_SUCCESS) {
                return;
            }
            // Check file id exists
            const id = _get(file.getResultHttpMessage(), 'id');
            if (!id) {
                return;
            }
            // Update value
            if (this.props.multiple) {
                this.props.input.onChange(
                    [].concat(this.props.input.value || []).concat([id])
                );
            } else {
                this.props.input.onChange(id);
            }
        }

        /**
         * Triggered by queue when file is removed from it
         * @param {File[]} files
         * @private
         */
        _onQueueRemove(files) {
            const toRemove = files
                .map(file => _get(file.getResultHttpMessage(), 'id'))
                .filter(Boolean);
            if (toRemove.length === 0) {
                return;
            }
            // Update value
            if (this.props.multiple) {
                this.props.input.onChange(
                    []
                        .concat(this.props.input.value || [])
                        .filter(id => toRemove.indexOf(parseInt(id)) === -1)
                );
            } else if (toRemove.indexOf(this.props.input.value) !== -1) {
                this.props.input.onChange(null);
            }
            this.forceUpdate();
        }

        /**
         * Show browse dialog in user browser
         * @param {object} event
         * @private
         */
        _onBrowse(event) {
            if (event) {
                event.preventDefault();
            }
            this._uploader.browse();
        }

        _onRemove(file) {
            this._uploader.queue.remove([file]);
        }
    }
