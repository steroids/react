import * as React from 'react';
import {IComponentsHocOutput} from './components';
import {useBem} from '../hooks';
import {IBem} from '../hooks/useBem';

/**
 * Bem HOC
 * Прокидывает утилиту `bem` для правильной генерации CSS классов по методологии БЭМ (блок, элемент, модификатор)
 */
export interface IBemHocInput {
    style?: any
}

export interface IBemHocOutput extends IComponentsHocOutput {
    bem?: IBem,
}

export default (namespace: string): any => WrappedComponent => function BemHoc(props) {
    const bem = useBem(namespace);
    return (
        <WrappedComponent
            {...props}
            bem={bem}
        />
    );
};
