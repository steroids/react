import {connect} from 'react-redux';

export type Dispatch = (any) => any;

/**
 * Connect HOC
 * Обертка над `connect()` из `react-redux` для упрощения импорта.
 */
export interface IConnectHocInput {
}

export interface IConnectHocOutput {
    dispatch?: Dispatch,
}

export default connect;