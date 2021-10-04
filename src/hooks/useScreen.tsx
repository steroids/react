import {useContext} from 'react';
import {ScreenContext, IScreen} from '../providers/ScreenProvider';

export default function useScreen(): IScreen {
    return useContext(ScreenContext);
}
