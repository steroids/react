/**
 * Мета информация о моделе
 */
export interface Model {
    primaryKey?: string,
    attributes?: (string | ModelAttribute)[],
}

export interface ModelAttribute {
    type?: 'autoTime' | 'boolean' | 'dateTime' | 'date' | 'double' | 'email' | 'enum' | 'file' | 'files' | 'html'
        | 'integer' | 'money' | 'password' | 'phone' | 'primaryKey' | 'size' | 'string' | 'text' | 'time' | string,
    jsType?: 'boolean' | 'string' | 'string[]' | 'number' | 'number[]' | string,
    attribute?: string,
    label?: string,
    hint?: string,
    isRequired?: boolean,
    isSortable?: boolean,
    field?: string | any,
    fieldProps?: Record<string, unknown>,
    searchField?: string | any,
    searchFieldProps?: Record<string, unknown>,
    formatter?: string | any,
    formatterProps?: Record<string, unknown>,
    defaultValue?: any,
    fromStringConverter?: (value: string, type: string, item: any) => any,
    toStringConverter?: (value: any, type: string, item: any) => string | null,
}

export interface IMetaComponent {
    /**
     * Изменить модель
     * @param name Имя модели.
     * @param item Модель.
     */
    setModel(name: string, item: Model): void,

    /**
     * Получить модель
     * @param name Имя модели.
     */
    getModel(name: string): Model,

    /**
     * Изменить тип
     * @param name Имя типа.
     * @param config Конфиг.
     */
    setType(name: string, config: Record<string, any>): void,

    /**
     * Получить тип
     * @param name Имя типа.
     */
    getType(name: string): any,

    /**
     * Форматирование названия модели
     * @param name Имя модели.
     */
    normalizeName(name: string): string,

    /**
     * Форматирование модели модели
     * @param inputModel Модель.
     * @param defaultModel Модель по-умолчанию.
     */
    normalizeModel(inputModel: Model, defaultModel: Model | any): Model,
}

/**
 * Meta Component
 * Компонент для работы с мета-данными моделей и типами приложения (appType)
 */
export default class MetaComponent implements IMetaComponent {
    defaultPrimaryKey: string;

    defaultAttributeType: string;

    models: any;

    types: any;

    _components: any;

    constructor(components) {
        this._components = components;
        this.models = {};
        this.types = this._defaultTypes();

        this.defaultPrimaryKey = 'id';
        this.defaultAttributeType = 'string';
    }

    setModel(name: string, item: Model) {
        name = this.normalizeName(name);
        item = this.normalizeModel(item);

        this.models[name] = item;
    }

    getModel(name: string) {
        return this.models[name] || null;
    }

    setType(name: string, config: Record<string, any>) {
        this.types[name] = config;
    }

    getType(name: string) {
        return this.types[name] || null;
    }

    normalizeName(name: string) {
        return name.replace(/\\/g, '.').replace(/^\./, '');
    }

    normalizeModel(inputModel: Model, defaultModel: Model | any = null) {
        if (!inputModel && !defaultModel) {
            return null;
        }

        inputModel = inputModel || {};
        defaultModel = defaultModel ? this.normalizeModel(defaultModel) : {};

        const defaults = {};
        (defaultModel.attributes || []).forEach(item => {
            if (typeof item !== 'string') {
                defaults[item.attribute] = item;
            }
        });

        // Normalize attributes config
        const attributes = [].concat(inputModel.attributes || []).map(item => {
            if (typeof item === 'string') {
                const parts = item.split(':');

                item = {
                    attribute: parts[0],
                    type: parts[1] || null,
                    label: parts[2] || null,
                };
            }

            return {
                type: this.defaultAttributeType,
                attribute: null,
                label: null,
                hint: null,
                isRequired: false,
                isSortable: false,
                ...defaults[item.attribute],
                ...this.getType(item.type || this.defaultAttributeType),
                ...item,
            };
        });

        // Add non-exists default attributes
        const attributeNames = attributes.map(item => item.attribute);
        (defaultModel.attributes || []).forEach(item => {
            if (typeof item !== 'string' && !attributeNames.includes(item.attribute)) {
                attributes.push(item);
            }
        });

        return {
            primaryKey: inputModel.primaryKey || defaultModel.primaryKey || this.defaultPrimaryKey,
            attributes,
        };
    }

    protected _defaultTypes() {
        return {
            autoTime: {
                jsType: 'string',
                field: 'DateTimeField',
                formatter: 'DateTimeFormatter',
            },
            boolean: {
                jsType: 'boolean',
                field: 'CheckboxField',
                formatter: 'BooleanFormatter',
            },
            dateTime: {
                jsType: 'string',
                field: 'DateTimeField',
                formatter: 'DateTimeFormatter',
            },
            date: {
                jsType: 'string',
                field: 'DateField',
                formatter: 'DateFormatter',
            },
            double: {
                jsType: 'number',
                field: 'NumberField',
            },
            email: {
                jsType: 'string',
                field: 'InputField',
                fieldProps: {
                    type: 'email',
                },
            },
            enum: {
                jsType: 'string',
                field: 'DropDownField',
                formatter: 'EnumFormatter',
            },
            file: {
                jsType: 'number',
                field: 'FileField',
                // TODO formatter: 'FileFormatter',
            },
            files: {
                jsType: 'number[]',
                field: 'FileField',
                fieldProps: {
                    multiple: true,
                },
                // TODO formatter: 'FileFormatter',
            },
            html: {
                jsType: 'string',
                field: 'HtmlField',
                // TODO formatter: 'HtmlFormatter',
            },
            integer: {
                jsType: 'number',
                field: 'NumberField',
            },
            password: {
                jsType: 'string',
                field: 'PasswordField',
            },
            phone: {
                jsType: 'string',
                field: 'InputField',
                fieldProps: {
                    type: 'phone',
                },
            },
            primaryKey: {
                jsType: 'number',
                field: 'InputField',
                fieldProps: {
                    type: 'hidden',
                },
                searchFieldProps: {
                    type: 'text',
                },
            },
            string: {
                jsType: 'string',
                field: 'InputField',
            },
            text: {
                jsType: 'string',
                field: 'TextField',
            },
            time: {
                jsType: 'string',
                field: 'TimeField',
                formatter: 'TimeFormatter',
            },
        };
    }
}
