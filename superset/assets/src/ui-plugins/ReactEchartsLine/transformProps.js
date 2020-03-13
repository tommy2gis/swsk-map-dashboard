export default function transformProps(chartProps) {
  const { width, height, formData, queryData } = chartProps;
  const { sliceId, colorScheme, numberFormat,yAxisBounds,showLegend,groupby, pshowMulti, dshowMulti,selectTheme } = formData;

  return {
    width,
    height,
    sliceId,
    groupby,
    yAxisBounds,showLegend,
    data: queryData.data,
    colorScheme,
    numberFormat,
    selectTheme,
    pshowMulti,
    dshowMulti,
  };
}
