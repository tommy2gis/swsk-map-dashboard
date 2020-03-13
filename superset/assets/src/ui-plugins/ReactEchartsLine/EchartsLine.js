/* eslint-disable no-param-reassign */
/* eslint dot-notation: "off" */
/* eslint object-shorthand: "off" */
/* eslint no-nested-ternary: "off" */
/* eslint max-len: "off" */
/* eslint no-else-return: "off" */
/* eslint no-console: "off" */
import d3 from 'd3';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { formatNumber } from '@superset-ui/number-format';
import dark from '../theme/dark';
import darkblue from '../theme/darkblue';
echarts.registerTheme('dark', dark);
echarts.registerTheme('darkblue', darkblue);


const propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
  sliceId: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  colorScheme: PropTypes.string,
  numberFormat: PropTypes.string,
};

function formatSeries(seriesData,groupby) {
  const dimensions = seriesData;
  const series = [];
  for (const key in dimensions) {
    groupby.forEach(item => {
      if (key != "timestamp" && key != item) {
        series.push({
          type: 'line'
        });
      }
    });

    
  }
  return series;
}

function formatLegend(seriesName) {
  const legend = seriesName.slice();
  legend.push('timestamp');
  return legend.reverse().slice(0, -1);
}

function selectThemeFun(selectTheme) {
  return selectTheme == '暗黑' ? 'dark' : selectTheme == '深蓝' ? 'darkblue' : 'default';
}

function EchartsLine(element, props) {
  const { data, sliceId, width, height, groupby,colorScheme,yAxisBounds,showLegend,selectTheme, numberFormat } = props;

  const div = d3.select(element);
  const Id = 'echarts_slice_' + sliceId;
  const html = '<div id=' + Id + ' style="width:' + width + 'px;height:' + height + 'px;"></div>';
  div.html(html);

  const myChart = echarts.init(document.getElementById(Id),selectThemeFun(selectTheme));

  const option = {
    color: CategoricalColorNamespace.getScale(colorScheme).colors,
    legend: {
      show:showLegend
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
      position: function(pos, params, dom, rect, size) {
        const topPercent = 0.08; // equal 8% in grid option
        const offset =
          pos[1] < size.viewSize[1] / 2
            ? +(size.viewSize[1] * topPercent * 2)
            : -(size.viewSize[1] * topPercent * 2);
        return {
          // top: (pos[1] + size.contentSize[1] < size.viewSize[1]) ? pos[1] : (pos[1] < size.viewSize[1] / 2) ? pos[1] : pos[1] - (pos[1] + size.contentSize[1] - size.viewSize[1]),
          top:
            pos[1] -
            (pos[1] / (size.viewSize[1] * (1 - topPercent * 2))) * size.contentSize[1] +
            offset,
          left:
            pos[0] + size.contentSize[0] < size.viewSize[0]
              ? pos[0]
              : pos[0] < size.viewSize[0] / 2
              ? pos[0]
              : pos[0] - (pos[0] + size.contentSize[0] - size.viewSize[0]),
        };
      },
    },
    dataset: {
      source: data,
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
      max:yAxisBounds[0],
      min:yAxisBounds[1]
    },
    grid: {
      left: '3%',
      right: '3%',
      top: '8%',
      bottom: '5%',
      containLabel: true,
    },
    series: formatSeries(data[0],groupby),
    useUTC: true,
  };
  myChart.setOption(option);

  let allSelect = true;
  myChart.on('dblclick', function(params) {
    allSelect = !allSelect;
    const dynamicSelected = {};
    for (const index in seriesName) {
      if (params.seriesName !== seriesName[index]) {
        dynamicSelected[seriesName[index]] = allSelect;
      }
    }
    myChart.setOption({
      legend: {
        selected: dynamicSelected,
      },
    });
  });
}

EchartsLine.displayName = 'EchartsLine';
EchartsLine.propTypes = propTypes;

export default EchartsLine;
