import * as React from 'react';
import '@fortawesome/fontawesome-free/js/all.min'

import Icon from '../Icon';
import {AutoCompleteField, Form} from "../../../form";
import {getFontAwesomeIconNames} from "../../../../../react-bootstrap/icon/fontawesome-icons";

type IconState = {
    iconName?: string | null
};

/**
 * Install the latest free version of Font Awesome via yarn:
 * ```
 * $ yarn add @fortawesome/fontawesome-free
 * ```
 *
 * in your root style file (e.g. index.scss) import fontawesome styles
 * ```
 *  @import "~@fortawesome/fontawesome-free/scss/fontawesome";
 * ```
 *
 * and in hoc @application add the following code
 * ```
 *   ui.addIcons(getFontAwesomeIcons())
 * ```
 *
 * That get the icon used <Icon name={'icon-name'} />
 */
export default class extends React.PureComponent<{}, IconState> {

    constructor(props) {
        super(props);
        this.state = {
            iconName: null
        };
    }

    renderSelectIcon() {
        if (!this.state.iconName) {
            return null;
        }
        return (
            <div style={{padding: '50px', height: '200px', width: '200px'}}>
                <Icon
                    name={this.state.iconName}
                />
            </div>
        )
    }

    render() {
        const icons = getFontAwesomeIconNames();
        return (
            <>
                <Form formId={'icon-search'}>
                    <AutoCompleteField
                        attribute={'searchField'}
                        items={icons.map((iconName, index) => {
                            return {
                                id: index,
                                label: iconName,
                            };
                        })}
                        onSelect={item => {
                            this.setState({iconName: item.label})
                        }}
                    />
                </Form>

                <div>Current Icon</div>
                {this.renderSelectIcon()}

                <div className='row'>
                    {icons.map((iconName, index) => {
                        return (
                            <div
                                key={index}
                                className={'col-md-1'}
                            >
                                <Icon
                                    name={iconName}
                                />
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}
