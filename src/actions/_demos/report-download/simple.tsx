import { OSProviderWrapper } from '@ty-one-start/one-start';
import { OSActionsReportDownload } from '@/actions';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSActionsReportDownload
        settings={{
          triggerButtonText: '下载报告',
          modalTitle: '下载报告',
          menu: [
            {
              text: '文件1',
              key: 'file1',
            },
            {
              text: '文件2',
              key: 'file2',
            },
          ],
        }}
        requests={{
          requestReportDownload: async (options) => {
            console.log(options);
            await delay(1000);
            // eslint-disable-next-line no-return-assign
            return {
              error: false,
              data: {
                message: '自定义下载成功',
                file: '',
              },
            };
          },
        }}
      />
    </OSProviderWrapper>
  );
};
