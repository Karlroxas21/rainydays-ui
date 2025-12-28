import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function ArrowRightIcon(props: SvgProps) {
    return (
        <Svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="#000000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}