import { OSProviderWrapper } from '@ty-one-start/one-start';
import { OSActionsOperate } from '@/actions';
import { Typography } from '@ty/antd';
import delay from 'delay';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSActionsOperate
        settings={{
          modalTitle: '确认删除吗？',
          triggerButtonText: '确认',
          danger: true,
          alert: {
            type: 'warning',
            message: (
              <div>
                <Typography.Paragraph>
                  1.交易被删除后，其生命周期事件和未处理的资金流水也会一并被删除，实时报告将会随之更新，但已经生成的日终报告不会受到影响。
                </Typography.Paragraph>
                <div>2.删除操作无法撤销。</div>
              </div>
            ),
          },
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
                  placeholder: '请输入删除理由（选填）',
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
