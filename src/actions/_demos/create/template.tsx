import { OSProviderWrapper } from '@ty-one-start/one-start';
import { OSActionsCreate } from '@/actions';
import { mock } from 'mockjs';
import moment from 'moment';
import React from 'react';

export default () => {
  return (
    <OSProviderWrapper>
      <OSActionsCreate
        settings={{
          enableTemplate: true,
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
          templateSearchTableSettings: {
            fieldItems: [
              {
                type: 'text',
                settings: {
                  title: 'name',
                  dataIndex: 'name',
                },
              },
            ],
          },
        }}
        requests={{
          requestCreateSource: async () => {
            return false;
          },
          requestTemplateList: async () => {
            return mock({
              error: false,
              data: {
                total: 20,
                'page|20': [
                  {
                    id: '@id',
                    name: '@name',
                  },
                ],
              },
            });
          },
          requestApplayTemplateData: async () => {
            return mock({
              error: false,
              data: {
                templateId: 'templateId',
                templateName: 'templateName',
                values: {
                  select: 'a',
                  date: '2021-10-01',
                  'date-range': ['2021-10-01', '2021-10-10'],
                  money: 10000,
                  percent: 10000,
                  digit: 10000,
                  textarea: 'textarea',
                  text: 'text',
                  'editable-table': [
                    {
                      id: '1',
                      text: 'text',
                    },
                  ],
                },
              },
            });
          },
        }}
      />
    </OSProviderWrapper>
  );
};
