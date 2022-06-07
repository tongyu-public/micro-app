import { OSActionsRecount } from '@/actions';
import { OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSActionsRecount
        settings={{
          triggerButtonText: '重新计算',
          modalTitle: '重新计算',
          getCurrentStateInterval: 5000,
          formSettings: {
            fieldItemSettings: {
              labelCol: {
                span: 4,
              },
              wrapperCol: {
                span: 20,
              },
            },
            fieldItems: [
              {
                type: 'date',
                settings: {
                  dataIndex: 'date',
                  title: '日期',
                },
              },
            ],
          },
        }}
        requests={{
          requestCurrentStatus: async (options) => {
            console.log(options);
            await delay(1000);
            // eslint-disable-next-line no-return-assign
            return {
              error: false,
              data: {
                recountingStatus: 0,
                triggerDate: '2021-02-33 20:21:22',
              },
            };
          },
          requestRecount: async (options) => {
            console.log(options);
            await delay(1000);
            return {
              error: false,
            };
          },
        }}
      />
    </OSProviderWrapper>
  );
};
