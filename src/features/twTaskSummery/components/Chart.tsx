import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  data: number[];
  color: string;
};

const SimpleLineChart: FC<Props> = ({ data, color }) => {
  // 1. Define Data & Dimensions
  const chartWidth = 100;
  const chartHeight = 100;

  // 2. Math Calculations for Mapping Data to Coordinate Systems
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const valRange = maxVal - minVal || 1;

  // Map each array entry to an (X, Y) SVG Coordinate point
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    // SVGs render (0,0) from the top-left, so invert the Y value
    const y = chartHeight - ((val - minVal) / valRange) * chartHeight;
    return { x, y };
  });

  // 3. Create the SVG Path string (e.g., "M 0 150 L 50 100...")
  const pathD = points.reduce((acc, point, index) => {
    return index === 0
      ? `M ${point.x} ${point.y}`
      : `${acc} L ${point.x} ${point.y}`;
  }, '');

  return (
    <Svg width={chartWidth} height={chartHeight}>
      <Path d={pathD} fill="none" stroke={color} strokeWidth="2" />
    </Svg>
  );
};

export default SimpleLineChart;
