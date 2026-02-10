import React from 'react';

import {useBem} from '../../../../src/hooks';
import {constants, DetailLayoutEnum, IDetailViewProps} from '../../../../src/ui/content/Detail/Detail';
import Controls from '../../../../src/ui/nav/Controls/Controls';
import ControlsMockView from '../../nav/Controls/ControlsMockView';

export default function DetailView(props: IDetailViewProps) {
    const bem = useBem('DetailView');

    return (
        <div
            className={bem(bem.block(), props.className)}
            ref={props.resizedNodeRef}
        >
            {(props.title || props.controls) && (
                <div className={bem.element('header')}>
                    {props.title && (
                        <div className={bem.element('title')}>{props.title}</div>
                    )}
                    {props.controls && (
                        <Controls
                            view={ControlsMockView}
                            items={props.controls}
                            className={bem.element('controls')}
                        />
                    )}
                </div>
            )}
            <div className={bem.element('table-container')}>
                <table className={bem.element('table')}>
                    <tbody>
                        {props.rows.map((row, rowIndex) => {
                            if (props.layout === DetailLayoutEnum.Vertical) {
                                return (
                                    <React.Fragment key={rowIndex}>
                                        <tr className={bem.element('row')}>
                                            {row.map((cell, cellIndex) => (
                                                <th
                                                    key={cellIndex}
                                                    colSpan={cell.colspan}
                                                    className={bem(bem.element('label', {
                                                        size: props.size,
                                                    }), cell.labelClassName)}
                                                >
                                                    {cell.label}
                                                </th>
                                            ))}
                                        </tr>
                                        <tr className={bem.element('row')}>
                                            {row.map((cell, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    colSpan={cell.colspan}
                                                    className={bem(bem.element('value', {
                                                        size: props.size,
                                                    }), cell.contentClassName)}
                                                >
                                                    {cell.value}
                                                </td>
                                            ))}
                                        </tr>
                                    </React.Fragment>
                                );
                            }

                            return (
                                <tr
                                    key={rowIndex}
                                    className={bem.element('row')}
                                >
                                    {row.map((cell, cellIndex) => (
                                        <React.Fragment key={cellIndex}>
                                            <th
                                                colSpan={constants.TABLE_HEAD_COLSPAN}
                                                className={bem(bem.element('label', {
                                                    size: props.size,
                                                }), cell.labelClassName)}
                                            >
                                                {cell.label}
                                            </th>
                                            <td
                                                colSpan={cell.colspan}
                                                className={bem(bem.element('value', {
                                                    size: props.size,

                                                }), cell.contentClassName)}
                                            >
                                                {cell.value}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
