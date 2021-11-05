import { DireflowComponent } from 'direflow-component';
import Wrapper from './Wrapper';

export default DireflowComponent.create({
  component: Wrapper,
  configuration: {
    tagname: 'simfinity-web',
  },
  plugins: [
    {
      name: 'font-loader',
      options: {
        google: {
          families: ['Advent Pro', 'Noto Sans JP'],
        },
      },
    },
  ],
});
