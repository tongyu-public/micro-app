import { OSProviderWrapper } from '@ty-one-start/one-start';
import { OSActionsOperate } from '@/actions';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSActionsOperate
        settings={{
          modalTitle: '确认审批吗？',
          triggerButtonText: '确认',
          formSettings: {
            fieldItems: [
              {
                type: 'textarea',
                settings: {
                  dataIndex: 'textarea',
                  labelCol: {
                    span: 0,
                  },
                  wrapperCol: {
                    span: 24,
                  },
                  styles: {
                    marginBottom: 0,
                  },
                  placeholder: '请输入审批通过意见（可选）',
                },
              },
            ],
          },
        }}
        requests={{
          requestAfterConfirm: async ({ values }) => {
            console.log(values);
            await delay(1000);
            return false;
          },
        }}
      />
    </OSProviderWrapper>
  );
};
