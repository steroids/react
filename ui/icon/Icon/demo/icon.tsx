import * as React from 'react';
import '@fortawesome/fontawesome-free/js/all.min'

import Icon from '../Icon';
import {getFontAwesomeIconNames} from "../../../../../react-bootstrap/icon/fontawesome-icons";

type IconState = {
    selectedIcons: any
};

export default class extends React.PureComponent<{}, IconState> {

    constructor(props) {
        super(props);

        this.state = {
            selectedIcons: null,
        };
    }

    renderIcons(icons) {
        return (
            <div className='row'>
                {icons.map((iconName, index) => {
                    return (
                        <div className='col-md-1 p-3' key={index}>
                            <div>
                                <Icon
                                    name={iconName}
                                />
                            </div>
                            <div style={{padding: '20px', textAlign: 'center'}}>{iconName}</div>
                        </div>
                    );
                })}
            </div>
        )
    }

    renderSelectIcons(icons) {
        if (!this.state.selectedIcons) {
            return this.renderIcons(icons)
        }
        return this.renderIcons(this.state.selectedIcons);
    }

    render() {
        const icons = getFontAwesomeIconNames();
        return (
            <>
                <input
                    className='form-control'
                    onChange={(event) => {
                        const value = event.target.value;
                        if (value.length === 0) {
                            this.setState({selectedIcons: null})
                            return
                        }
                        const selectedIcons = icons.filter(iconName => {
                            return iconName.indexOf(value) === 0;
                        })
                        this.setState({selectedIcons: selectedIcons})
                    }}
                />

                {this.renderSelectIcons(icons)}
            </>
        );
    }
}
