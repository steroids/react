export type Dispatch = (any) => any;

export interface IConnectHocOutput {
    dispatch?: Dispatch,
}

export default require('react-redux').connect;
