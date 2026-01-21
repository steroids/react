import '@testing-library/jest-dom';
import {renderHook} from '@testing-library/react';

import {useModel} from '../../src/hooks';
import useComponents from '../../src/hooks/useComponents';

jest.mock('../../src/hooks/useComponents');

const mockedUseComponents = (useComponents as jest.Mock);

describe('useModel Hook', () => {
    const normalizedModel = {
        attributes: [{
            attribute: 'page',
            defaultValue: 1,
            hint: null,
            isRequired: false,
            isSortable: false,
            label: null,
            type: 'number',
        }],
        primaryKey: 'id',
    };

    const componentsMock = {
        meta: {
            normalizeModel: jest.fn().mockImplementation(
                (inputModel: any, defaultModel: any = null) => {
                    if (!inputModel && !defaultModel) {
                        return null;
                    }

                    return normalizedModel;
                },
            ),
            getModel: jest.fn().mockReturnValue(null),
        },
    };

    beforeEach(() => {
        mockedUseComponents.mockReturnValue(componentsMock);
        jest.clearAllMocks();
    });

    it('should call getModel when passed a model string', () => {
        const mockedStringModel = 'string model';

        renderHook(() => useModel(mockedStringModel));

        expect(componentsMock.meta.getModel).toHaveBeenCalledWith(mockedStringModel);
    });

    it('should call normalizeModel with getModel value when passed a model is not string', () => {
        const mockedModel = {
            model: 'model',
        };

        const mockedDefaultModel = {
            defaultModel: 'defaultModel',
        };

        renderHook(() => useModel(mockedModel, mockedDefaultModel));

        expect(componentsMock.meta.normalizeModel).toHaveBeenCalledWith(mockedModel, mockedDefaultModel);
    });

    it('should return null when passed model and default model is null', () => {
        const mockedModel = null;
        const mockedDefaultModel = null;
        const expectedResult = null;

        const {result} = renderHook(() => useModel(mockedModel, mockedDefaultModel));

        expect(result.current).toBe(expectedResult);
    });

    it('should return the normalized model', () => {
        const mockedModel = {
            model: 'model',
        };

        const mockedDefaultModel = {
            defaultModel: 'defaultModel',
        };

        const {result} = renderHook(() => useModel(mockedModel, mockedDefaultModel));

        expect(result.current).toBe(normalizedModel);
    });

    it('should trigger generate new normalized model only when props changed', () => {
        const mockedModel = 'testModel';
        const newMockedModel = 'newTestModel';
        const expectedCallsBeforeRerender = 1;
        const expectedCallsAfterRerender = 2;

        const {rerender} = renderHook(({model}) => useModel(model), {
            initialProps: {
                model: mockedModel,
            },
        });

        expect(componentsMock.meta.getModel).toHaveBeenCalledWith(mockedModel);
        expect(componentsMock.meta.getModel).toHaveBeenCalledTimes(expectedCallsBeforeRerender);

        rerender({model: mockedModel});

        expect(componentsMock.meta.getModel).toHaveBeenCalledTimes(expectedCallsBeforeRerender);

        rerender({model: newMockedModel});

        expect(componentsMock.meta.getModel).toHaveBeenCalledWith(newMockedModel);
        expect(componentsMock.meta.getModel).toHaveBeenCalledTimes(expectedCallsAfterRerender);

        expect(newMockedModel).not.toBe(mockedModel);
    });
});
