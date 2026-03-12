import * as React from 'react';

import {useComponents} from '../hooks';

export interface ITheme {
    theme: string,
    toggleTheme: VoidFunction,
    setTheme: React.Dispatch<any>,
}

export interface IThemeProviderProps extends React.PropsWithChildren<any> {
    themes?: string[],
    themeStorageKey?: string,
}

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

const DEFAULT_THEMES = [
    LIGHT_THEME,
    DARK_THEME,
];

const DEFAULT_THEME_STORAGE_KEY = 'theme';

export const ThemeContext = React.createContext({} as ITheme);

export default function ThemeProvider(props: IThemeProviderProps) {
    const themes = props.themes || DEFAULT_THEMES;
    const themeStorageKey = props.themeStorageKey || DEFAULT_THEME_STORAGE_KEY;

    const {clientStorage} = useComponents();
    const [theme, setTheme] = React.useState(clientStorage.get(themeStorageKey) || themes[0]);

    const toggleTheme = React.useCallback(() => {
        const themesExpectedCount = 2;
        if (themes.length !== themesExpectedCount) {
            throw new Error('toggleTheme callback can only be used if the number of themes is two');
        }

        const lightTheme = themes[0];
        const darkTheme = themes[1];

        setTheme(theme === lightTheme ? darkTheme : lightTheme);
    }, [theme, themes]);

    React.useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
        clientStorage.set(themeStorageKey, theme);
    }, [theme, clientStorage, themeStorageKey]);

    const value: ITheme = React.useMemo(() => ({
        theme,
        toggleTheme,
        setTheme,
    }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {props.children}
        </ThemeContext.Provider>
    );
}
