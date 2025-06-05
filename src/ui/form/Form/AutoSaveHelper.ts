import _isString from 'lodash-es/isString';

export default class AutoSaveHelper {
    static STORAGE_KEY_PREFIX = 'Form';

    static restore(clientStorage, formId, initialValues) {
        const values = clientStorage.get(`${AutoSaveHelper.STORAGE_KEY_PREFIX}_${formId}`) || '';

        if (_isString(values) && values.substr(0, 1) === '{') {
            return {
                ...initialValues,
                ...JSON.parse(values),
            };
        }

        return initialValues;
    }

    static save(clientStorage, formId, values) {
        clientStorage.set(
            `${AutoSaveHelper.STORAGE_KEY_PREFIX}_${formId}`,
            JSON.stringify(values),
        );
    }

    static remove(clientStorage, formId) {
        clientStorage.remove(`${AutoSaveHelper.STORAGE_KEY_PREFIX}_${formId}`);
    }
}
