import type { RecordType } from '@ty-one-start/one-start';
import { QIANKUN_GLOBAL } from './constants/login';

// qiankun 动态配置，如果检测到是子应用访问就在全局添加一个标记
export const qiankun = {
  async mount(props: { base: string; fromPage?: boolean; pageProps?: RecordType }) {
    console.log(props);
    window[QIANKUN_GLOBAL.IS_SLAVE_APP] = true;
    window[QIANKUN_GLOBAL.FROM_PAGE] = !!props.fromPage;
    window[QIANKUN_GLOBAL.PAGE_PROPS] = props.pageProps;
  },
  // 应用卸载之后触发
  async unmount() {
    delete window[QIANKUN_GLOBAL.IS_SLAVE_APP];
    delete window[QIANKUN_GLOBAL.FROM_PAGE];
    delete window[QIANKUN_GLOBAL.PAGE_PROPS];
  },
};
