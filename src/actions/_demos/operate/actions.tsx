import { OSProviderWrapper } from '@ty-one-start/one-start';
import type { OSActionsOperateAPI } from '@/actions';
import { OSActionsOperate, OSActionsReportDownload } from '@/actions';
import delay from 'delay';
import React, { useRef } from 'react';

export default () => {
  const ref = useRef<OSActionsOperateAPI>(null);

  return (
    <OSProviderWrapper>
      <OSActionsOperate
        ref={ref}
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
              {
                type: 'custom',
                settings: {
                  dataIndex: 'custom',
                  title: 'custom',
                  element: (
                    <span
                      onClick={() => {
                        ref.current?.setFieldsValue({
                          textarea: 'hi',
                        });
                      }}
                    >
                      set data
                    </span>
                  ),
                },
              },
            ],
          },
          actions: [
            <OSActionsReportDownload
              settings={{
                triggerButtonText: '下载报告',
                modalTitle: '下载报告',
                formsSettings: {
                  file1: {
                    fieldItemSettings: {
                      labelCol: {
                        span: 0,
                      },
                      wrapperCol: {
                        span: 24,
                      },
                    },
                    fieldItems: [
                      {
                        type: 'date',
                        settings: {
                          dataIndex: 'date',
                        },
                      },
                    ],
                  },
                  file2: {
                    fieldItemSettings: {
                      labelCol: {
                        span: 0,
                      },
                      wrapperCol: {
                        span: 24,
                      },
                    },
                    fieldItems: [
                      {
                        type: 'textarea',
                        settings: {
                          dataIndex: 'textarea',
                        },
                      },
                    ],
                  },
                },
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
            />,
          ],
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
