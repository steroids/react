import {useContext} from 'react';
import {ScreenContext} from '../hooks/useApplication';
import {IScreen} from './useApplication';

export default function useScreen(): IScreen {
    return useContext(ScreenContext);
}
