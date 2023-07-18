import React, {useContext} from 'react';
import {ITheme, ThemeContext} from 'src/providers/ThemeProvider';

export default function useTheme(): ITheme {
    return useContext(ThemeContext);
}
