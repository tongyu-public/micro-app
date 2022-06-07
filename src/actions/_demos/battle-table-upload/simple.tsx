import type { RecordType } from '@ty-one-start/one-start';
import { OSForm, OSProviderWrapper } from '@ty-one-start/one-start';
import { OSBattleTableUpload } from '@/actions';
import { Divider } from '@ty/antd';
import delay from 'delay';
import { mock, Random } from 'mockjs';
import moment from 'moment';
import { useState } from 'react';

export default () => {
  const [values, setValues] = useState<RecordType | undefined>({});
  return (
    <OSProviderWrapper>
      <OSForm
        settings={{
          layout: 'inline',
          fieldItems: [
            {
              type: 'switch',
              settings: {
                title: '是否一定上传成功',
                dataIndex: 'uploadSuccess',
              },
            },
          ],
        }}
        onChange={setValues}
      ></OSForm>
      <Divider />
      <OSBattleTableUpload
        settings={{
          modalTitle: '估值表',
          triggerText: '估值表',
          triggerSettings: {
            type: 'text',
            plain: true,
          },
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'frameContractNumber',
                title: '框架合约编号',
              },
            },
            {
              type: 'text',
              key: 'stock',
              settings: {
                dataIndex: 'stock',
                title: '个股',
              },
            },
            {
              type: 'text',
              key: 'stockIndexFutures',
              settings: {
                dataIndex: 'stockIndexFutures',
                title: '股指期货',
              },
            },
          ],
          attachmentFieldKeys: {
            stock: {
              baseDataIndex: 'frameContractNumber',
              suffix: ['.xlsx', '.xls'],
            },
            stockIndexFutures: {
              baseDataIndex: 'frameContractNumber',
              suffix: '.gif',
            },
          },
          extraFormFieldItems: [
            {
              type: 'date',
              settings: {
                dataIndex: 'date',
                title: '交易日期',
              },
            },
          ],
          extraFormInitialValues: {
            date: moment(),
          },
        }}
        requests={{
          requestDataSource: async () => {
            return mock({
              error: false,
              data: {
                'page|30': [
                  {
                    frameContractNumber: () => Random.increment(),
                    id: '@id',
                  },
                ],
                total: 30,
              },
            });
          },
          requestWhenUpload: async (options) => {
            console.log(options);
            await delay(1000);

            if (values?.uploadSuccess) {
              return {
                error: false,
              };
            }

            return {
              error: false,
              data: {
                errorMessages: {
                  [options.files![0].attachmentId]: mock({
                    'list|1-10': [
                      {
                        title: () => Random.title(),
                        desc: () => Random.paragraph(1, 3),
                      },
                    ],
                  }).list,
                },
              },
            };
          },
        }}
      />
    </OSProviderWrapper>
  );
};
