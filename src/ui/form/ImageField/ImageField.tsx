import * as React from 'react';
import File from 'fileup-core/lib/models/File';
import _first from 'lodash-es/first';
import _values from 'lodash-es/values';
import {useMemo, useCallback, useState, useEffect} from 'react';
import _uniqueId from 'lodash-es/uniqueId';
import ReactCropProps, {Crop} from 'react-image-crop';
import {useComponents} from '../../../hooks';
import {IFileFieldItemViewProps} from '../FileField/FileField';
import {IModalProps} from '../../modal/Modal/Modal';
import useDispatch from '../../../hooks/useDispatch';
import useFile from '../../../hooks/useFile';
import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {IFileHocInput, IFileHocOutput} from '../../../hoc/file';
import {openModal} from '../../../actions/modal';
import {IButtonProps} from '../Button/Button';

export interface ICropInputProps {
    /**
     * Изначальные параметры обрезки изображения
     * @example {unit: 'px', aspect: 1, x: 0, y: 0, width: 200, height: 200}
     */
    initialValues?: Crop,

    /**
     * Экшн для отправки параметров обрезки на бэкенд
     * @example '/api/v1/user/avatar/crop'
     */
    backendUrl?: string,

    /**
     * Пропсы для модуля react-image-crop
     * @example {maxWidth: 400, maxHeight: 400}
     */
    reactImageCropProps?: ReactCropProps
}

export interface IImageFieldProps extends IFieldWrapperInputProps, Omit<IFileHocInput, 'multiple' | 'imagesOnly'>, IFileHocOutput {

    /**
     * Дополнительный CSS-класс для компонента
     */
    className?: CssClassName;

    /**
     * Переопределение внешнего вида компонента
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Переопределение внешнего вида модального окна
     * @example MyCustomModalView
     */
    modalView?: CustomView;

    /**
     * Пропсы для модального окна
     */
    modalProps?: IModalProps;

    /**
     * Параметры обрезки
     */
    crop?: ICropInputProps,

    /**
     * Название кнопки
     * @example 'Загрузить'
     */
    label?: string,

    [key: string]: any;
}

export interface ICropOutputProps extends ICropInputProps {
    onSubmit: (crop: Crop, imageId: any) => void
}

export interface IImageFieldModalViewProps extends IModalProps {
    crop: ICropOutputProps,
    image: Record<string, any>,
}

export interface IImageFieldViewProps extends IImageFieldProps {
    item: {
        uid?: string,
        fileId?: number | string,
        title?: string,
        size: number | string,
        disabled?: boolean,
        onRemove?: () => void,
        error?: string,
        image?: {
            url: string,
            width: string,
            height: string,
        },
        progress?: {
            bytesUploaded: number,
            percent: number,
        },
    },
    onClick: (e: Event) => void
}

function ImageField(props: IImageFieldProps & IFieldWrapperOutputProps): JSX.Element {
    const components = useComponents();
    const dispatch = useDispatch();

    // Add cropping option
    const [croppedImage, setCroppedImage] = useState(null);
    const modalId = useMemo(() => props.modalProps?.modalId || _uniqueId('cropModal'), [props.modalProps.modalId]);
    const ImageFieldModalVIew = props.modalView || components.ui.getView('form.ImageFieldModalView');
    const responseParser = useCallback(text => {
        let data = null;
        try {
            data = JSON.parse(text);
            dispatch(openModal(ImageFieldModalVIew, {
                modalId,
                ...props.modalProps,
                crop: {
                    ...props.crop,
                    onSubmit: (crop, imageId) => setCroppedImage({...crop, id: imageId}),
                },
                image: _first(data),
            }));
            // eslint-disable-next-line no-empty
        } catch (e) {}
        return data;
    }, [ImageFieldModalVIew, modalId, dispatch, props.crop, props.modalProps]);

    const {files, onBrowse, onRemove, onAdd} = useFile({
        ...props,
        multiple: false,
        imagesOnly: true,
        uploader: {
            uploaderConfigs: {
                xhr: {
                    responseParser,
                },
            },
            ...props.uploader,
        },
    });

    // Fetch cropped image
    useEffect(() => {
        if (croppedImage) {
            components.http.post(props.crop.backendUrl, croppedImage).then((res: any) => {
                setCroppedImage(null);
                onAdd(new File({
                    path: res.title || res.label || res.uid || res.id,
                    status: File.STATUS_END,
                    result: File.RESULT_SUCCESS,
                    resultHttpStatus: 200,
                    resultHttpMessage: res,
                    uid: res.uid,
                }));
            });
        }
    }, [components.http, croppedImage, onAdd, onRemove, props.crop.backendUrl]);

    const ImageFieldView = props.view || components.ui.getView('form.ImageFieldView');

    const item = useMemo(() => {
        let result = null;
        const _file = _first(files);

        if (_file) {
            const data = _file.getResultHttpMessage() || {};
            result = {
                uid: _file.getUid(),
                fileId: data.id || null,
                title: _file.getName(),
                size: props.size,
                disabled: props.disabled,
                onRemove: () => onRemove(_file),
                error: null,
                image: null,
                progress: null,
            };
            // Add error
            if (_file.getResult() === File.RESULT_ERROR) {
                if (typeof _file.getResultHttpMessage() === 'string'
                    && _file.getResultHttpMessage().substr(0, 1) === '{') {
                    const errorResponse = JSON.parse(_file.getResultHttpMessage());
                    result.error = errorResponse.error || errorResponse.message || __('Ошибка');
                } else {
                    result.error = _file.getResultHttpMessage()
                        ? JSON.stringify(_file.getResultHttpMessage())
                        : __('Ошибка');
                }
            }
            // Add thumbnail image
            if (data.images) {
                // Image object has properties: url, width, height
                result.image = data.images[props.imagesProcessor]
                    || _first(_values(data.images));
            }
            // Add progress
            if (_file.getStatus() === File.STATUS_PROCESS) {
                result.progress = {
                    bytesUploaded: _file.getBytesUploaded(),
                    percent: _file.progress.getPercent(),
                };
            }
        }

        return result;
    }, [files, onRemove, props.disabled, props.imagesProcessor, props.size]);

    return (
        <ImageFieldView
            {...props}
            item={item}
            onClick={onBrowse}
        />
    );
}

ImageField.defaultProps = {
    disabled: false,
    required: false,
    className: '',
    modalProps: {},
    label: 'Upload',
    crop: {
        initialValues: {
            aspect: 1,
        },
    },
};

export default fieldWrapper('ImageField', ImageField);
