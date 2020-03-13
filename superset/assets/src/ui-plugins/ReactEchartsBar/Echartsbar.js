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


function formatSeries(seriesData, groupby, columns,showBarValue) {
  const dimensions = seriesData;
  const series = [];
  for (const key in dimensions) {
    groupby.forEach(item => {
      if (key != "timestamp" && key != item) {
        if (columns) {
          columns.forEach(col => {
            if (key != col) {
              series.push({
                type: "bar",
                label: {
                  normal: {
                      show: showBarValue,
                      position: 'top'
                  }
              }
              });
            }
          });
        } else {
          series.push({
            type: "bar",
            label: {
              normal: {
                  show: showBarValue,
                  position: 'top'
              }
          }
          });
        }
      }
    });
  }
  return series;
}

// function groupBy(array, f) {
//   debugger;
//   var groups = {};
//   array.forEach(function (o) {
//       var group = JSON.stringify(f(o));
//       groups[group] = groups[group] || [];
//       groups[group].push(o);
//   });
//   return Object.keys(groups).map(function (group) {
//       return groups[group];
//   });
// }

const groupBy = (arr, func) =>
  arr
    .map(typeof func === "function" ? func : val => val[func])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i]);
      return acc;
    }, {});

function formatLegend(seriesName) {
  const legend = seriesName.slice();
  legend.push('timestamp');
  return legend.reverse().slice(0, -1);
}

function getTimeLineOption(props) {
  const {colorScheme, data, groupby,columns,showLegend,showBarValue,bottomMargin}=props;
  let { timeline, timelineoptions } = transform(data, columns);
  return {
    baseOption: {
        color: CategoricalColorNamespace.getScale(colorScheme).colors,
        timeline: {
            autoPlay: true,
            axisType: 'category',
            playInterval: 1000,
            label: {
              formatter : function(s) {
                  return (new Date(s)).getFullYear();
              }
            },
            controlStyle:{
              color : '#fff',
              itemSize:16,
              showPrevBtn:false,
              showNextBtn:false
            },
            data: timeline
        },
        
        legend: {
          show: showLegend
        },
        tooltip: {
        },
       
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          left: '3%',
          right: '3%',
          top: '8%',
          bottom: bottomMargin?bottomMargin+'px':'100px',
          containLabel: true,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: true,
                    formatter: function (params) {
                        return params.value.replace('\n', '');
                    }
                }
            }
        }
        },
        series: formatSeries(data[0], groupby,columns,showBarValue),
    },
    options: timelineoptions
}
}


function transform(data, columns) {
  let columnsdata = groupBy(data, function (item) {
    return [item[columns[0]]];
  });
  let timeline=[];
  let timelinedatas = [];
  let timelineoptions = [];
  let coldatacopy=JSON.parse(JSON.stringify(columnsdata));
  for (const key in coldatacopy) {

    
    coldatacopy[key].map(col => {
      delete col[columns[0]]
      return col
    });
    timelinedatas.push({
      key: key,
      datas: {
        dataset: {
          source: coldatacopy[key],
        }
      }
    });
  }
  function compare(a, b) {
    const genreA = a.key;
    const genreB = b.key;
    
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }
  timelinedatas=timelinedatas.sort(compare);
  timelinedatas.forEach(item => {
    timeline.push(item.key);
    timelineoptions.push(item.datas);
  });
  return { timeline, timelineoptions };
}

function getOption(props) {
  const {colorScheme, data, groupby,showLegend,showBarValue,bottomMargin}=props;
  return {
    color: CategoricalColorNamespace.getScale(colorScheme).colors,
    legend: {
      show: showLegend
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
      position: function (pos, params, dom, rect, size) {
        const topPercent = 0.08; // equal 8% in grid option
        const offset = pos[1] < size.viewSize[1] / 2
          ? +(size.viewSize[1] * topPercent * 2)
          : -(size.viewSize[1] * topPercent * 2);
        return {
          // top: (pos[1] + size.contentSize[1] < size.viewSize[1]) ? pos[1] : (pos[1] < size.viewSize[1] / 2) ? pos[1] : pos[1] - (pos[1] + size.contentSize[1] - size.viewSize[1]),
          top: pos[1] -
            (pos[1] / (size.viewSize[1] * (1 - topPercent * 2))) * size.contentSize[1] +
            offset,
          left: pos[0] + size.contentSize[0] < size.viewSize[0]
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
      type: 'value'
    },
    grid: {
      left: '3%',
      right: '3%',
      top: '8%',
      bottom: bottomMargin?bottomMargin+'px':'100px',
      containLabel: true,
    },
    series: formatSeries(data[0], groupby,null,showBarValue),
    useUTC: true,
  };
}

function selectThemeFun(selectTheme) {
  return selectTheme == '暗黑' ? 'dark' : selectTheme == '深蓝' ? 'darkblue' : 'default';
}


function EchartsBar(element, props) {
  const { sliceId, width, height,columns,selectTheme } = props;

  const div = d3.select(element);
  const Id = 'echarts_slice_' + sliceId;
  const html = '<div id=' + Id + ' style="width:' + width + 'px;height:' + height + 'px;"></div>';
  div.html(html);

  const myChart = echarts.init(document.getElementById(Id),selectThemeFun(selectTheme));
  if(columns.length>0){
    const option = getTimeLineOption(props);
    myChart.setOption(option);
  }else{
    const option = getOption(props);
    myChart.setOption(option);
  }
 

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

EchartsBar.displayName = 'EchartsBar';
EchartsBar.propTypes = propTypes;

export default EchartsBar;



