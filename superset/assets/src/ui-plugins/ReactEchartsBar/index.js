import { t } from '@superset-ui/translation';
import { ChartMetadata, ChartPlugin } from '@superset-ui/chart';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.jpg';

const metadata = new ChartMetadata({
  name: 'Echarts Bar',
  description: '',
  thumbnail,
  useLegacyApi: true,
});

export default class EchartsBarChartPlugin extends ChartPlugin {
  constructor() {
    super({
      metadata,
      transformProps,
      loadChart: () => import('./ReactEchartsBar'),
    });
  }
}
