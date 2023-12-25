import '@testing-library/jest-dom';
import {renderHook, act} from '@testing-library/react';
import FileUp from 'fileup-core';
import File from 'fileup-core/lib/models/File';
import {useFile} from '../../src/hooks';
import useComponents from '../../src/hooks/useComponents';
import componentsMock from '../mocks/componentsMock';

import {generateBackendUrl} from '../../src/hooks/useFile';

describe('generateBackendUrl', () => {
    const backendUrl = 'https://example.com/api';

    it('should generate a valid URL with default options', () => {
        const expectedUrl = 'https://example.com/api';

        const props = {
            backendUrl,
        };

        const result = generateBackendUrl(props);

        expect(result).toEqual(expectedUrl);
    });

    it('should generate a URL with custom mimeTypes when imagesOnly is false', () => {
        const expectedUrl = 'https://example.com/api?mimeTypes[]=image%2Fjpeg&mimeTypes[]=image%2Fpng';

        const props = {
            backendUrl,
            imagesOnly: false,
            mimeTypes: ['image/jpeg', 'image/png'],
        };

        const result = generateBackendUrl(props);

        expect(result).toEqual(expectedUrl);
    });

    it('should include imagesProcessor and imagesExactSize in the URL when provided', () => {
        const expectedUrl = 'https://example.com/api?imagesProcessor=resize&imagesExactSize=true';

        const props = {
            backendUrl,
            imagesProcessor: 'resize',
            imagesExactSize: true,
        };

        const result = generateBackendUrl(props);

        expect(result).toEqual(expectedUrl);
    });
});

jest.mock('../../src/hooks/useComponents');
const mockedUseComponents = (useComponents as jest.Mock);

describe('useFile Hook', () => {
    const mockedProps = {
        disabled: false,
        required: true,
        filesLayout: 'list',
        className: '',
        showRemove: true,
        multiple: false,
        backendUrl: 'https://site/api/v1/file/upload-photo',
        input: {
            name: 'fileId',
            value: null,
            onChange: jest.fn(),
        },
    };

    beforeEach(() => {
        mockedUseComponents.mockReturnValue(componentsMock);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const expectedFunctionType = 'function';
        const expectedFilesIsArray = true;
        const expectedFilesLength = 0;

        const {result} = renderHook(() => useFile(mockedProps));
        const {uploader, files, onBrowse, onRemove, onAdd} = result.current;

        expect(uploader).toBeDefined();
        expect(uploader).toBeInstanceOf(FileUp);
        expect(Array.isArray(files)).toBe(expectedFilesIsArray);
        expect(files.length).toBe(expectedFilesLength);
        expect(typeof onBrowse).toBe(expectedFunctionType);
        expect(typeof onRemove).toBe(expectedFunctionType);
        expect(typeof onAdd).toBe(expectedFunctionType);
    });

    it('should normalize and upload initial files', () => {
        const initialFiles = [
            {
                uid: '1',
                title: 'File 1',
            },
            {
                uid: '2',
                title: 'File 2',
            },
        ];
        const {result} = renderHook(() => useFile({
            ...mockedProps,
            initialFiles,
        }));

        const {files} = result.current;

        expect(files.length).toBe(initialFiles.length);
        expect(files[0].getUid()).toBe(initialFiles[0].uid);
        expect(files[1].getUid()).toBe(initialFiles[1].uid);
        expect(files[0]).toBeInstanceOf(File);
        expect(files[1]).toBeInstanceOf(File);
    });

    it('should handle if initial files does not have correct format', () => {
        const initialFiles = [
            {title: 'File 1'},
            {
                uid: '2',
                title: 'File 2',
            },
        ];
        const expectedQueueFilesLength = initialFiles.length - 1;

        const {result} = renderHook(() => useFile({
            ...mockedProps,
            initialFiles,
        }));

        const {uploader, files} = result.current;
        const queueFiles = uploader.queue.getFiles();

        expect(queueFiles.length).toEqual(files.length);
        expect(queueFiles[0].getUid()).toEqual(files[0].getUid());
        expect(files.length).toBe(expectedQueueFilesLength);
        expect(files[0].getUid()).toBe(initialFiles[1].uid);
    });

    it('should handle "onAdd" callback', () => {
        const fileToAdd = new File({
            uid: '1',
            path: 'file',
            status: File.STATUS_END,
            result: File.RESULT_SUCCESS,
            resultHttpStatus: 200,
            resultHttpMessage: 'successfully',
        });

        const expectedQueueFilesLengthBeforeOnAdd = 0;
        const expectedQueueFilesLengthAfterOnAdd = 1;

        const {result} = renderHook(() => useFile(mockedProps));

        const {uploader, onAdd} = result.current;

        expect(uploader.queue.getFiles().length).toBe(expectedQueueFilesLengthBeforeOnAdd);

        act(() => {
            onAdd(fileToAdd);
        });

        expect(uploader.queue.getFiles().length).toBe(expectedQueueFilesLengthAfterOnAdd);
    });

    it('should handle "onRemove" callback', () => {
        const expectedQueueFilesLengthBeforeRemove = 1;
        const expectedQueueFilesLengthAfterRemove = 0;

        const {result} = renderHook(() => useFile(mockedProps));

        const {uploader, onRemove} = result.current;

        uploader.queue.add([new File({
            uid: '1',
            path: 'file',
            status: File.STATUS_END,
            result: File.RESULT_SUCCESS,
            resultHttpStatus: 200,
            resultHttpMessage: 'successfully',
        })]);

        expect(uploader.queue.getFiles().length).toBe(expectedQueueFilesLengthBeforeRemove);

        act(() => {
            const fileToRemove = uploader.queue.getFiles()[0];
            onRemove(fileToRemove);
        });

        expect(uploader.queue.getFiles().length).toBe(expectedQueueFilesLengthAfterRemove);
    });

    it('should remove files from the uploader queue when input value changes', () => {
        const expectedUid = '1';
        const expectedQueueLength = 1;

        const {result, rerender} = renderHook(({props}) => useFile(props), {
            initialProps: {
                props: {
                    ...mockedProps,
                    input: {
                        name: 'fileId',
                        value: [1, 2],
                        onChange: jest.fn(),
                    },
                },
            },
        });

        result.current.uploader.queue.add([
            new File({
                uid: '1',
                path: 'file',
                status: File.STATUS_END,
                result: File.RESULT_SUCCESS,
                resultHttpStatus: 200,
                resultHttpMessage: {
                    id: 1,
                },
            }),
            new File({
                uid: '2',
                path: 'file',
                status: File.STATUS_END,
                result: File.RESULT_SUCCESS,
                resultHttpStatus: 200,
                resultHttpMessage: {
                    id: 2,
                },
            }),
        ]);

        rerender({
            props: {
                ...mockedProps,
                input: {
                    name: 'fileId',
                    value: [1],
                    onChange: jest.fn(),
                },

            },
        });

        const queueFiles = result.current.uploader.queue.getFiles();

        expect(queueFiles[0].getUid()).toEqual(expectedUid);
        expect(queueFiles.length).toBe(expectedQueueLength);
    });

    it('should handle multiply update', () => {
        const expectedMultiplePropValueBeforeUpdate = false;
        const expectedMultiplePropValueAfterUpdate = true;

        const {result, rerender} = renderHook(({props}) => useFile(props), {
            initialProps: {
                props: {
                    ...mockedProps,
                    multiple: false,
                },
            },
        });

        const {uploader} = result.current;

        expect(uploader.form.multiple).toEqual(expectedMultiplePropValueBeforeUpdate);

        rerender({
            props: {
                ...mockedProps,
                multiple: true,
            },
        });

        expect(uploader.form.multiple).toEqual(expectedMultiplePropValueAfterUpdate);
    });
});
