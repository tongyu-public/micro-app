import { OSProviderWrapper } from '@ty-one-start/one-start';
import { OSActionsTemplateUpload } from '@/actions';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSActionsTemplateUpload
        settings={{
          buttonTriggerText: '上传模板',
          templates: [
            {
              fileName: '模板文件1.xlsx',
            },
          ],
          suffixs: ['.xlsx', '.xls'],
        }}
        requests={{
          requestUploadReportData: async () => {
            await delay(1000);
            return false;
          },
          requestDownloadTemplateData: async () => {
            await delay(1000);
            return false;
          },
        }}
      />
    </OSProviderWrapper>
  );
};
