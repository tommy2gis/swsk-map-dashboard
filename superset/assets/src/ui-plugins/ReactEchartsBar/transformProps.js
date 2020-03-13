export default function transformProps(chartProps) {
  const { width, height, formData, queryData } = chartProps;
  const { sliceId, colorScheme,showBarValue,
    showControls,bottomMargin,
    showLegend, numberFormat, pshowMulti, dshowMulti,groupby,columns,selectTheme } = formData;

  return {
    width,
    height,
    sliceId,
    columns,
    groupby,
    bottomMargin,
    selectTheme,
    showBarValue,
    showControls,
    showLegend,
    data: queryData.data,
    colorScheme,
    numberFormat,
    pshowMulti,
    dshowMulti,
  };
}
