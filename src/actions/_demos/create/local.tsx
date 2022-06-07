import { OSProviderWrapper } from '@ty-one-start/one-start';
import { OSActionsCreate } from '@/actions';
import { Space } from '@ty/antd';
import moment from 'moment';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <Space split={'|'}>
        <OSActionsCreate
          settings={{
            createModalDialogSettings: {
              width: '80%',
              title: '创建框架合约',
            },
            createFormSettings: {
              labelCol: {
                span: 10,
              },
              wrapperCol: {
                span: 14,
              },
              fieldItems: [
                {
                  type: 'select',
                  settings: {
                    dataIndex: 'select',
                    title: 'select',
                    valueEnums: {
                      a: 'A',
                      b: 'B',
                    },
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'editable-table',
                  settings: {
                    title: 'editable-table',
                    dataIndex: 'editable-table',
                    addable: {},
                    styles: {
                      marginBottom: 30,
                    },
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    labelCol: {
                      flex: '0 0 13.888888%',
                    },
                    wrapperCol: {
                      flex: '1 1',
                    },
                    fieldItems: [
                      {
                        type: 'text',
                        settings: {
                          title: 'text',
                          dataIndex: 'text',
                          editable: true,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'text',
                  settings: {
                    title: 'text',
                    dataIndex: 'text',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'date',
                  settings: {
                    dataIndex: 'date',
                    title: 'date',
                    initialValue: moment(),
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'date-range',
                  settings: {
                    dataIndex: 'date-range',
                    title: 'date-range',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                },
                {
                  type: 'money',
                  settings: {
                    title: 'money',
                    dataIndex: 'money',
                    min: 0,
                    tooltip: '取值范围为 [0, Infinity]',
                    rules: [
                      {
                        required: true,
                      },
                      {
                        ruleType: 'digital-accuracy',
                        settings: {
                          integersMaxLen: 12,
                          floatsMaxLen: 2,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'percent',
                  settings: {
                    title: 'percent',
                    dataIndex: 'percent',
                    // 2. 合约固定收益率 正数
                    min: 0,
                    tooltip: '取值范围为 [0%, Infinity]',
                    rules: [
                      {
                        required: true,
                      },
                      {
                        ruleType: 'digital-accuracy',
                        settings: {
                          floatsMaxLen: 6,
                          integersMaxLen: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'digit',
                  settings: {
                    title: 'digit',
                    dataIndex: 'digit',
                    initialValue: 365,
                    min: 0,
                    tooltip: '取值范围为 [0, Infinity]',
                    rules: [
                      {
                        required: true,
                      },
                      {
                        ruleType: 'digital-accuracy',
                        settings: {
                          floatsMaxLen: 0,
                          integersMaxLen: 3,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'textarea',
                  settings: {
                    title: 'textarea',
                    dataIndex: 'textarea',
                    labelCol: {
                      flex: '0 0 13.888888%',
                    },
                    wrapperCol: {
                      flex: '1 1',
                    },
                  },
                },
              ],
            },
          }}
          requests={{
            requestCreateSource: async () => {
              return false;
            },
          }}
        />
      </Space>
    </OSProviderWrapper>
  );
};
