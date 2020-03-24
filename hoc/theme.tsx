import * as React from 'react';

export interface IThemeContext {
    /**
     * Укажите `true` для переключения на темную тему
     */
    dark?: boolean,

    /**
     * Размер элемента
     */
    size?: Size,
}

export interface IThemeHocInput extends IThemeContext {
}

export interface IThemeHocOutput extends IThemeHocInput {
}

export const defaultTheme = {
    size: 'md',
    dark: false,
} as IThemeContext;

export const ThemeContext = React.createContext(defaultTheme as IThemeContext);

export default (config: IThemeContext = {}): any => WrappedComponent =>
    class FormHoc extends React.PureComponent<IThemeHocInput> {
        static WrappedComponent = WrappedComponent;

        render() {
            return (
                <ThemeContext.Consumer>
                    {context => {
                        const outputProps = {
                            dark: typeof this.props.dark === 'boolean' ? this.props.dark : context.dark,
                            size: this.props.size || context.size,
                            ...config,
                        } as IThemeHocOutput;

                        return (
                            <ThemeContext.Provider value={outputProps}>
                                <WrappedComponent {...this.props} {...outputProps} />
                            </ThemeContext.Provider>
                        );
                    }}
                </ThemeContext.Consumer>
            );
        }
    }
