import {useContext} from 'react';
import {ITheme, ThemeContext} from '../providers/ThemeProvider';

export default function useTheme(): ITheme {
    return useContext(ThemeContext);
}
