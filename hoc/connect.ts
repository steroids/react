import {connect} from 'react-redux';

export type Dispatch = (any) => any;

export interface IConnectHocInput {
}

export interface IConnectHocOutput {
    dispatch?: Dispatch,
}

export default connect;
