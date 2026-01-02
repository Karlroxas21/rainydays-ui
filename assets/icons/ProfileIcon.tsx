import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function ProfileIcon(props: SvgProps) {
    return (
        <Svg width={20} height={20} viewBox="0 0 13 15" fill="none" {...props}>
            <Path
                d="M12.5 14.5V12.9444C12.5 12.1193 12.1388 11.328 11.4958 10.7446C10.8528 10.1611 9.98074 9.83333 9.07143 9.83333H3.92857C3.01926 9.83333 2.14719 10.1611 1.50421 10.7446C0.861223 11.328 0.5 12.1193 0.5 12.9444V14.5M9.92857 3.61111C9.92857 5.32933 8.39355 6.72222 6.5 6.72222C4.60645 6.72222 3.07143 5.32933 3.07143 3.61111C3.07143 1.89289 4.60645 0.5 6.5 0.5C8.39355 0.5 9.92857 1.89289 9.92857 3.61111Z"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
