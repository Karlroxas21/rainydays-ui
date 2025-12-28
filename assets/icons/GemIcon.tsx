import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function GemIcon(props: SvgProps) {
    return (
        <Svg width={20} height={20} viewBox="0 0 18 18" fill="none" {...props}>
            <Path
                d="M16.5 6.75L13.5 2.25H4.5L1.5 6.75M16.5 6.75L9 16.5M16.5 6.75H1.5M9 16.5L1.5 6.75M9 16.5L6 6.75L8.25 2.25M9 16.5L12 6.75L9.75 2.25"
                stroke="black"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
