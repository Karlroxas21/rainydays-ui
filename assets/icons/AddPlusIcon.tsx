import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';
export default function AddPlusIcon(props: SvgProps) {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
            <G id="Edit / Add_Plus">
                <Path
                    id="Vector"
                    d="M6 12H12M12 12H18M12 12V18M12 12V6"
                    stroke="#000000"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </G>
        </Svg>
    );
}
