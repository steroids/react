import * as React from 'react';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import _remove from 'lodash-es/remove';
import _isString from 'lodash-es/isString';
import _isArray from 'lodash-es/isArray';
import _isFunction from 'lodash-es/isFunction';
import _includes from 'lodash-es/includes';
import _uniqBy from 'lodash-es/uniqBy';
import _isBoolean from 'lodash-es/isBoolean';

import {getEnumLabels} from '../reducers/fields';
import {IFieldHocOutput} from './field';
import components, {IComponentsHocOutput} from './components';
import {IFieldHocInput} from "./field";
import Enum from "../base/Enum";
import {IConnectHocOutput} from './connect';
import normalize, {INormalizeHocConfig} from './normalize';
import {smartSearch} from '../utils/text';
import {normalizeItems} from '../utils/data';

export interface IDataProviderHocInput {
    input?: FormInputType,
    multiple?: boolean;
    items?: string
        | ({ new(): Enum })
        | (string | number | { id: string | number | boolean, label: string | any })[],
    dataProvider?: {
        action?: string,
        params?: object,
        onSearch?: (...args: any) => any,
    };
    autoComplete?: boolean | {
        enable?: boolean,
        minLength?: number,
        delay?: number,
    };
    autoFetch?: any;
    selectFirst?: any;
    onSelect?: any;
    valueItemKey?: string,
}

export interface IDataProviderHocOutput {
    items?: {
        id: number | string | boolean,
        label?: string,
    }[] | any; // TODO any
    selectedItems?: any,
    hoveredItem?: any,
    isOpened?: boolean,
    isLoading?: boolean,
    onOpen?: any,
    onClose?: any,
    onSearch?: any,
    onItemClick?: any,
    onItemMouseOver?: any,
}

interface IDataProviderHocPrivateProps extends IConnectHocOutput, IFieldHocOutput, IFieldHocInput, IComponentsHocOutput {
    formId: string,
    _autoComplete: {
        enable?: boolean,
        minLength?: number,
        delay?: number,
    }
}

interface IDataProviderHocState {
    query: string,
    isOpened: boolean,
    isFocused: boolean,
    isLoading: boolean,
    hoveredItem: any,
    selectedItems: any,
    sourceItems: any,
    items: any,
}


const defaultProps = {
    autoComplete: {
        enable: false,
        minLength: 2,
        delay: 100,
    },
    valueItemKey: 'id',
};

const normalizeMap = [
    {
        fromKey: 'autoComplete',
        toKey: '_autoComplete',
        normalizer: autoComplete => ({
            ...defaultProps.autoComplete,
            ...(_isBoolean(autoComplete) ? {enable: autoComplete} : autoComplete),
        }),
    },
] as INormalizeHocConfig[];

const stateMap = (state, props) => ({
    items: _isString(props.items)
        ? getEnumLabels(state, props.items)
        : props.items
});
export default (): any => WrappedComponent =>
    connect(stateMap)(
        normalize(normalizeMap)(
            components('http')(
                class DataProviderHoc extends React.PureComponent<IDataProviderHocInput & IDataProviderHocPrivateProps, IDataProviderHocState> {

                    _delayTimer: any;

                    static WrappedComponent = WrappedComponent;
                    /**
                     * Proxy real name, prop types and default props for storybook
                     */
                    static displayName = WrappedComponent.displayName || WrappedComponent.name;

                    static defaultProps = defaultProps;

                    constructor(props) {
                        super(props);

                        this._onOpen = this._onOpen.bind(this);
                        this._onClose = this._onClose.bind(this);
                        this._onSearch = this._onSearch.bind(this);
                        this._onItemClick = this._onItemClick.bind(this);
                        this._onItemMouseOver = this._onItemMouseOver.bind(this);
                        this._onKeyDown = this._onKeyDown.bind(this);
                        this._delayTimer = null;
                        const sourceItems = normalizeItems(this.props.items);
                        this.state = {
                            query: '',
                            isOpened: false,
                            isFocused: false,
                            isLoading: false,
                            hoveredItem: null,
                            selectedItems: this._findSelectedItems(
                                sourceItems,
                                this.props.input.value
                            ),
                            sourceItems,
                            items: sourceItems
                        };
                    }

                    UNSAFE_componentWillMount() {
                        // Select first value on mount
                        if (this.props.selectFirst && this.state.items.length > 0) {
                            this._onItemClick(this.state.items[0]);
                        }
                        // Check to auto fetch items first page
                        if (this.props.autoFetch && this.props.dataProvider) {
                            this._searchDataProvider('', true);
                        }
                        // Async load selected labels from backend
                        // TODO
                        /*if (values.length > 0 && !this.getLabel()) {
                                  this.props.dispatch(fetchByIds(this.props.fieldId, values, {
                                      model: this.props.modelClass,
                                      attribute: this.props.attribute,
                                  }));
                              }*/
                    }

                    UNSAFE_componentWillReceiveProps(nextProps) {
                        // Refresh normalized source items on change items from props
                        if (this.props.items !== nextProps.items) {
                            const sourceItems = normalizeItems(nextProps.items);
                            this.setState({
                                sourceItems,
                                items: sourceItems
                            });
                            // Select first value on fetch data
                            if (
                                (this.props.items || []).length === 0 &&
                                (nextProps.items || []).length > 0 &&
                                this.props.selectFirst
                            ) {
                                this._onItemClick(sourceItems[0]);
                            }
                        }
                        // Store selected items in state on change value
                        if (this.props.input.value !== nextProps.input.value) {
                            const sourceItems = normalizeItems(nextProps.items);
                            this.setState({
                                selectedItems: this._findSelectedItems(
                                    _uniqBy(
                                        [].concat(
                                            sourceItems,
                                            this.state.items,
                                            this.state.sourceItems,
                                            this.state.selectedItems
                                        ),
                                        'id'
                                    ),
                                    nextProps.input.value
                                )
                            });
                        }
                        // Check auto fetch on change autoFetch flag or data provider config
                        if (
                            nextProps.autoFetch &&
                            nextProps.dataProvider &&
                            (!this.props.autoFetch ||
                                this.props.dataProvider !== nextProps.dataProvider)
                        ) {
                            this._searchDataProvider('');
                        }
                    }

                    componentDidMount() {
                        if (process.env.IS_WEB) {
                            window.addEventListener('keydown', this._onKeyDown);
                        }
                    }

                    componentWillUnmount() {
                        if (process.env.IS_WEB) {
                            window.removeEventListener('keydown', this._onKeyDown);
                        }
                    }

                    render() {
                        return (
                            <WrappedComponent
                                {...this.props}
                                autoComplete={this.props._autoComplete}
                                selectedItems={this.state.selectedItems}
                                hoveredItem={this.state.hoveredItem}
                                isOpened={this.state.isOpened}
                                isLoading={this.state.isLoading}
                                items={this.state.items}
                                onOpen={this._onOpen}
                                onClose={this._onClose}
                                onSearch={this._onSearch}
                                onItemClick={this._onItemClick}
                                onItemMouseOver={this._onItemMouseOver}
                            />
                        );
                    }

                    /**
                     * Get items by values
                     * @param {array} items
                     * @param {array|string} value
                     * @returns {array}
                     * @private
                     */
                    _findSelectedItems(items, value) {
                        const selectedValues =
                            value === false || value === 0 ? [value] : [].concat(value || []);
                        return items.filter(item => _includes(selectedValues, item[this.props.valueItemKey]));
                    }

                    /**
                     * Handler for user open items dropdown menu
                     * @private
                     */
                    _onOpen() {
                        this.setState({
                            isOpened: !this.state.isOpened,
                            items: this.state.sourceItems,
                            hoveredItem: null,
                        });
                    }

                    /**
                     * Handler for user close items dropdown menu
                     * @private
                     */
                    _onClose() {
                        this.setState({
                            isOpened: false,
                        });
                    }

                    /**
                     * Handler for user auto complete search by key down events
                     * @param {string} query
                     * @private
                     */
                    _onSearch(query) {
                        query = query || '';
                        this.setState({query});
                        if (this.props.dataProvider) {
                            if (this._delayTimer) {
                                clearTimeout(this._delayTimer);
                            }

                            // Min length query logic
                            if (query.length >= this.props._autoComplete.minLength) {
                                // Search with delay
                                this._delayTimer = setTimeout(() => this._searchDataProvider(query), this.props._autoComplete.delay);
                            }
                        } else {
                            // Client-side search on static items
                            this._searchClientSide(query);
                        }
                    }

                    /**
                     * Client-side search on static items
                     * @param {string} query
                     * @private
                     */
                    _searchClientSide(query) {
                        this.setState({
                            items: smartSearch(query, this.state.sourceItems),
                        });
                    }

                    /**
                     * Search by data provider (for example: http requests)
                     * @param {string} query
                     * @param {boolean} isAutoFetch
                     * @private
                     */
                    _searchDataProvider(query = '', isAutoFetch = false) {
                        if (!isAutoFetch && query.length < this.props._autoComplete.minLength) {
                            return;
                        }
                        const searchHandler =
                            this.props.dataProvider.onSearch ||
                            this.props.http.post.bind(this.props.http);
                        const result = searchHandler(this.props.dataProvider.action, {
                            query,
                            model: this.props.model,
                            attribute: this.props.attribute,
                            ...this.props.dataProvider.params
                        });
                        // Check is promise
                        if (result && _isFunction(result.then)) {
                            this.setState({isLoading: true});
                            result.then(items => {
                                items = normalizeItems(items);
                                this.setState({
                                    isLoading: false,
                                    items,
                                    sourceItems: isAutoFetch ? items : this.state.sourceItems
                                });
                            });
                        }
                        // Check is items list
                        if (_isArray(result)) {
                            const items = normalizeItems(result);
                            this.setState({
                                items,
                                sourceItems: isAutoFetch ? items : this.state.sourceItems
                            });
                        }
                    }

                    /**
                     * Handler for user click on item
                     * @param {object} item
                     * @param {boolean} skipToggle
                     * @private
                     */
                    _onItemClick(item, skipToggle = false) {
                        const value = item[this.props.valueItemKey];
                        if (this.props.multiple) {
                            const values = [].concat(this.props.input.value || []);
                            if (values.indexOf(value) !== -1) {
                                if (!skipToggle) {
                                    _remove(values, value => value === value);
                                }
                            } else {
                                values.push(value);
                            }
                            this.props.input.onChange(values);
                            // Fix bug. Without this calls component Form is not get differect values
                            // in componentWillReceiveProps and onChange handlers is not called.
                            if (this.props.formId) {
                                this.props.dispatch(
                                    change(this.props.formId, this.props.input.name, values)
                                );
                            }
                        } else {
                            if (this.props.input.value !== value) {
                                this.props.input.onChange(value);
                            }
                            this._onClose();
                        }
                        if (this.props.onSelect) {
                            this.props.onSelect(item, {
                                prefix: this.props.prefix,
                                name: this.props.input.name
                            });
                        }
                    }

                    /**
                     * Handler for user mouse over on item
                     * @param {object} item
                     * @private
                     */
                    _onItemMouseOver(item) {
                        this.setState({
                            hoveredItem: item
                        });
                    }

                    /**
                     * Global key down handler for navigate on items
                     * Support keys:
                     *  - tab
                     *  - esc
                     *  - enter
                     *  - up/down arrows
                     * @param {object} e
                     * @private
                     */
                    _onKeyDown(e) {
                        if (!this.state.isFocused && !this.state.isOpened) {
                            return;
                        }
                        switch (e.which) {
                            case 9: // tab
                            case 27: // esc
                                e.preventDefault();
                                this._onClose();
                                break;
                            case 13: // enter
                                if (this.state.isOpened) {
                                    e.preventDefault();
                                    if (this.state.hoveredItem) {
                                        // Select hovered
                                        this._onItemClick(this.state.hoveredItem, true);
                                    } else if (this.state.selectedItems.length > 0) {
                                        // Select first selected
                                        this._onItemClick(this.state.selectedItems[0], true);
                                    } else if (this.state.items.length > 0) {
                                        // Select first result
                                        this._onItemClick(this.state.items[0], true);
                                    }
                                }
                                break;
                            case 38: // arrow up
                            case 40: // arrow down
                                e.preventDefault();
                                const isDown = e.which === 40;
                                if (!this.state.isOpened) {
                                    // Open on down key
                                    if (isDown) {
                                        this._onOpen();
                                    }
                                    break;
                                }
                                // Navigate on items by keys
                                const direction = isDown ? 1 : -1;
                                const keys = this.state.items.map(item => item.id);
                                let index = this.state.hoveredItem
                                    ? keys.indexOf(this.state.hoveredItem.id)
                                    : -1;
                                if (index === -1 && this.state.selectedItems.length === 1) {
                                    index = keys.indexOf(this.state.selectedItems[0].id);
                                }
                                const newIndex =
                                    index !== -1
                                        ? Math.min(keys.length - 1, Math.max(0, index + direction))
                                        : 0;
                                this.setState({
                                    hoveredItem: this.state.items.find(
                                        item => item.id === keys[newIndex]
                                    )
                                });
                                break;
                        }
                    }
                }
            )
        )
    )
