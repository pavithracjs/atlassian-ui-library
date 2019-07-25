import React, { Component, ReactElement } from 'react';
import { sizeOptions } from '../constants';
interface WrapperProps {
    primaryColor?: string;
    secondaryColor?: string;
    size?: sizeOptions;
}
export declare const IconWrapper: import("styled-components").StyledComponentClass<React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement> & WrapperProps, any, React.ClassAttributes<HTMLSpanElement> & React.HTMLAttributes<HTMLSpanElement> & WrapperProps>;
export interface IconProps {
    /** Glyph to show by Icon component (not required when you import a glyph directly) */
    glyph?: (props: {
        role: string;
    }) => ReactElement;
    /** More performant than the glyph prop, but potentially dangerous if the SVG string hasn't
     been "sanitised" */
    dangerouslySetGlyph?: string;
    /** String to use as the aria-label for the icon. Set to an empty string if you are rendering the icon with visible text to prevent accessibility label duplication. */
    label: string;
    /** For primary colour for icons */
    primaryColor?: string;
    /** For secondary colour for 2-color icons. Set to inherit to control this via "fill" in CSS */
    secondaryColor?: string;
    /** Control the size of the icon */
    size?: sizeOptions;
}
export default class Icon extends Component<IconProps, {}> {
    static insertDynamicGradientID(svgStr: string): string;
    render(): JSX.Element;
}
export {};
