import {
  ApiTwoTone,
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
  InboxOutlined,
} from '@ant-design/icons';
import { List, message, Row, Space, Tabs, Typography, Upload } from '@ty/antd';
import type { RcFile } from '@ty/antd/lib/upload/interface';
import produce from 'immer';
import utl from 'lodash';
import React, { useRef, useState } from 'react';
import { OSDialog, OSForm, OSTable, OSTrigger } from '@ty-one-start/one-start';
import { normalizeRequestOutputs } from '@ty-one-start/one-start';
import { normalizeArray } from '@ty-one-start/one-start';
import type { RecordType } from '@ty-one-start/one-start';
import type { OSBattleTableUploadFileType, OSBattleTableUploadType } from '../_typings';
import type { OSDialogAPI, OSFormAPI, OSTableAPI, OSTableType } from '@ty-one-start/one-start';
import CloseIconAction from './close-icon-action';
import UploadIconAction from './upload-icon-action';

const { TabPane } = Tabs;

const { Dragger } = Upload;

export type MatchType = 'file-base' | 'suffix' | 'file-name';

const OSBattleTableUpload = (props: OSBattleTableUploadType) => {
  const { settings, requests } = props;
  const {
    triggerSettings,
    triggerText,
    modalTitle,
    fieldItems: tableFieldItems,
    attachmentFieldKeys,
    modalWidth,
    extraFormFieldItems,
    extraFormInitialValues,
  } = settings ?? {};
  const {
    requestDataSource: requestDataSourceWithTable,
    requestExtraFormDataSource,
    requestWhenUpload,
  } = requests ?? {};
  const [fullFileList, setFullFileList] = useState<OSBattleTableUploadFileType[]>([]);
  const [errorTabActiveKey, setErrorTabActiveKey] = useState('');

  const prepareUploadList = fullFileList.filter((item) => !item.uploaded);
  /**
   * {
   *    31.xlsx: {
   *       0: true,
   *       1: false
   *    }
   * }
   */
  const [todos, setTodos] = useState<Record<string, Record<string, boolean>>>({});

  const tableRef = useRef<OSTableAPI>(null);
  const extraFormRef = useRef<OSFormAPI>(null);
  const dialogRef = useRef<OSDialogAPI>(null);
  const errorDialogRef = useRef<OSDialogAPI>(null);

  const getAttachmentId = (attachmentFieldKey: string, rowId: string) => {
    return `${rowId}-${attachmentFieldKey}`;
  };

  const fieldItems: Required<OSTableType>['settings']['fieldItems'] = tableFieldItems?.map(
    (item) => {
      if (attachmentFieldKeys?.[item.key ?? '']) {
        const meta = attachmentFieldKeys[item.key ?? ''];
        return {
          ...item,
          type: 'group',
          settings: {
            align: 'center',
            ...item.settings,
          },
          children: [
            {
              type: 'text',
              settings: {
                dataIndex: `${item.key}-attachmentInfo`,
                title: '附件信息',
              },
              render: ({ rowData, rowId }) => {
                const attachmentId = getAttachmentId(item.key!, rowId);
                const file = fullFileList.find((it) => it.attachmentId === attachmentId);
                return (
                  <Typography.Text type={file ? undefined : 'secondary'}>
                    {`${rowData[meta.baseDataIndex]}${(() => {
                      if (Array.isArray(meta.suffix) && meta.suffix.length) {
                        return `[${meta.suffix.sort().join(', ')}]`;
                      }
                      return meta.suffix;
                    })()}`}
                    {file ? `(${file.file.name})` : null}
                  </Typography.Text>
                );
              },
            },
            {
              type: 'text',
              settings: {
                dataIndex: `${item.key}-statusInfo`,
                title: '状态信息',
              },
              render: ({ rowId, rowData }) => {
                const attachmentKey = item.key!;
                const attachmentId = getAttachmentId(attachmentKey, rowId);
                const file = fullFileList.find((it) => it.attachmentId === attachmentId);
                const getStatus = () => {
                  if (file == null) {
                    return (
                      <Space>
                        <ApiTwoTone twoToneColor="#1890ff" />
                        <Typography.Text>等待选择</Typography.Text>
                      </Space>
                    );
                  }

                  if (file.uploaded) {
                    if (file?.errorMessages) {
                      return (
                        <Space>
                          <CloseCircleTwoTone twoToneColor="#f5222d" />
                          <Typography.Link
                            underline
                            onClick={() => {
                              errorDialogRef.current?.push();
                              setErrorTabActiveKey(file.name ?? '');
                            }}
                          >
                            上传错误
                          </Typography.Link>
                        </Space>
                      );
                    }
                    return (
                      <Space>
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                        <Typography.Text>上传成功</Typography.Text>
                      </Space>
                    );
                  }

                  return (
                    <Space>
                      <ClockCircleTwoTone twoToneColor="#1890ff" />
                      <Typography.Text>等待上传</Typography.Text>
                    </Space>
                  );
                };

                return (
                  <Row justify="space-between" align="middle">
                    {getStatus()}
                    <Space>
                      <UploadIconAction
                        onSelectedFile={(file_) => {
                          setFullFileList((prev) => {
                            const index = prev.findIndex((it) => it.attachmentId === attachmentId);
                            const newOne: OSBattleTableUploadFileType = {
                              file: file_,
                              rowData,
                              attachmentKey,
                              attachmentId,
                              name: `${rowData[meta.baseDataIndex]}${meta.suffix}`,
                            };
                            if (index > -1) {
                              prev.splice(index, 1, newOne);
                            } else {
                              return [...prev, newOne];
                            }

                            return [...prev];
                          });
                        }}
                      />
                      {file ? (
                        <CloseIconAction
                          onClick={() => {
                            setFullFileList((prev) => {
                              const index = prev.findIndex(
                                (it) => it.attachmentId === attachmentId,
                              );
                              prev.splice(index, 1);
                              return [...prev];
                            });
                          }}
                        />
                      ) : null}
                    </Space>
                  </Row>
                );
              },
            },
          ],
        };
      }
      return {
        ...item,
      };
    },
  );

  const clean = () => {
    setTodos({});
    setErrorTabActiveKey('');
    setFullFileList([]);
  };

  const handleBeforeUpload = utl.debounce((file: RcFile, fileList: RcFile[]) => {
    const pickFileName = (fileName: string) => {
      return fileName.split('.').slice(0, -1).join('');
    };

    const unionFileNameList = utl.unionBy(fileList, (fileItem) => pickFileName(fileItem.name));
    if (unionFileNameList.length !== fileList.length) {
      const matchList = utl.intersectionBy(unionFileNameList, fileList, (item) => item.name);
      const notMatchList = utl.differenceBy(fileList, matchList, (item) => item.name);

      message.warn(
        `存在同名文件(${utl
          .union(notMatchList.map((item) => pickFileName(item.name)))
          .join(', ')})，请重新选择文件`,
      );
      return false;
    }

    const list: {
      rowData: RecordType;
      attachmentKey: string;
      attachmentId: string;
      name: string;
    }[] = utl.flattenDeep(
      tableRef.current?.getDataSource()?.map((rowData) => {
        return Object.keys(attachmentFieldKeys ?? {}).map((key) => {
          const meta = attachmentFieldKeys![key];

          const suffixs = normalizeArray(meta.suffix);
          return suffixs.map((suffix) => {
            return {
              rowData,
              attachmentKey: key,
              attachmentId: getAttachmentId(key, rowData.id),
              name: `${rowData[meta.baseDataIndex]}${suffix}`,
            };
          });
        });
      }),
    );
    const matchList = utl.intersectionBy(list, fileList, (item) => item.name);
    const notMatchList = utl.differenceBy(fileList, matchList, (item) => item.name);

    message.info(
      `本次批量导入成功匹配 ${matchList.length} 个文件，失败 ${notMatchList.length} 个文件`,
    );

    setFullFileList((prev) => {
      const leftList = utl.differenceBy(prev, matchList, (item) => {
        return item.attachmentId;
      });
      return [
        ...leftList,
        ...matchList.map((item) => ({
          ...item,
          file: fileList.find((it) => it.name === item.name)!,
        })),
      ];
    });
    return false;
  }, 400);

  return (
    <>
      <OSDialog
        ref={dialogRef}
        type="modal-operation"
        settings={{
          type: 'confirm',
          title: modalTitle,
          width: modalWidth ?? '80%',
          confirmTriggerSettings: {
            text: `上传${prepareUploadList.length ? `(${prepareUploadList.length})` : ''}`,
            disabled: prepareUploadList.length === 0,
          },
          confirmTriggerWrapper: (
            <OSDialog
              type="popconfirm"
              settings={{
                title: `是否批量上传列表(${prepareUploadList
                  .map((item) => item.file.name)
                  .join(', ')})?`,
              }}
              requests={{
                requestAfterConfirm: async () => {
                  if (!requestWhenUpload) return false;

                  const vrsp = await extraFormRef.current?.validate();

                  if (vrsp?.error) return true;

                  const { error, data } = await requestWhenUpload({
                    values: vrsp?.data,
                    files: prepareUploadList,
                    fullFiles: fullFileList,
                  }).then(normalizeRequestOutputs);

                  if (error) {
                    return true;
                  }

                  let firstErrorFileMeta: OSBattleTableUploadFileType | undefined;

                  setFullFileList((prev) =>
                    prev.map((item) => {
                      if (data?.errorMessages?.[item.attachmentId] && firstErrorFileMeta == null) {
                        firstErrorFileMeta = item;
                      }
                      return {
                        ...item,
                        uploaded: true,
                        errorMessages:
                          data?.errorMessages?.[item.attachmentId] ?? item?.errorMessages,
                      };
                    }),
                  );

                  if (firstErrorFileMeta) {
                    errorDialogRef.current?.push();
                    setErrorTabActiveKey(firstErrorFileMeta?.name ?? '');
                  } else {
                    message.success('批量上传成功');
                  }

                  return false;
                },
              }}
            />
          ),
          content: (
            <div>
              <Dragger
                {...{
                  name: 'file',
                  multiple: true,
                  fileList: [],
                  beforeUpload: (file, fileList) => {
                    handleBeforeUpload(file, fileList);
                    return false;
                  },
                }}
              >
                <p>
                  <InboxOutlined style={{ fontSize: 40 }} />
                </p>
                <Typography.Paragraph style={{ marginBottom: 0 }} type="secondary">
                  点击或者拖拽文件进入该区域执行上传
                </Typography.Paragraph>
              </Dragger>
              {extraFormFieldItems ? (
                <div
                  style={{
                    padding: '10px 0',
                  }}
                >
                  <OSForm
                    ref={extraFormRef}
                    settings={{
                      fieldItems: extraFormFieldItems,
                      layout: 'inline',
                      initialValues: extraFormInitialValues,
                    }}
                    requests={{
                      requestDataSource: requestExtraFormDataSource,
                    }}
                    onChange={() => {
                      setFullFileList((prev) =>
                        prev.map((item) => {
                          if (item?.errorMessages) {
                            return {
                              ...item,
                              uploaded: false,
                              errorMessages: undefined,
                            };
                          }
                          return item;
                        }),
                      );
                    }}
                  />
                </div>
              ) : null}
              <OSTable
                ref={tableRef}
                settings={{
                  enableColumnsSettings: false,
                  fieldItems,
                }}
                requests={{
                  requestDataSource: requestDataSourceWithTable,
                }}
              />
            </div>
          ),
          corner: extraFormFieldItems ? (
            <Typography.Text type="secondary">
              修改表单信息后，将重置错误附件状态为等待上传
            </Typography.Text>
          ) : null,
        }}
        onVisibleChange={(visible) => {
          if (visible === false) {
            clean();
          }
        }}
      >
        <OSTrigger
          type="button"
          settings={{
            text: triggerText,
            ...triggerSettings,
          }}
        ></OSTrigger>
      </OSDialog>
      <OSDialog
        ref={errorDialogRef}
        type="modal-operation"
        settings={{
          type: 'info',
          title: '待处理错误事项',
          width: '60%',
          content: (
            <Tabs activeKey={errorTabActiveKey} onChange={setErrorTabActiveKey}>
              {fullFileList
                .filter((item) => item?.errorMessages)
                .map((meta) => {
                  return (
                    <TabPane
                      tab={`${meta.name}${
                        meta.name !== meta.file.name ? `(${meta.file.name})` : ''
                      }`}
                      key={meta.name}
                    >
                      <List
                        itemLayout="horizontal"
                        dataSource={meta?.errorMessages}
                        pagination={{
                          pageSize: 15,
                        }}
                        renderItem={(item, index) => (
                          <List.Item
                            actions={[
                              <Typography.Link
                                onClick={() => {
                                  setTodos(
                                    produce((draft) => {
                                      // eslint-disable-next-line no-param-reassign
                                      draft[meta.attachmentId] = {
                                        ...draft[meta.attachmentId],
                                        [index]: !draft[meta.attachmentId]?.[index],
                                      };
                                    }),
                                  );
                                }}
                              >
                                {todos[meta.attachmentId]?.[index] ? '取消' : '解决'}
                              </Typography.Link>,
                            ]}
                          >
                            <List.Item.Meta
                              title={
                                <Typography.Text
                                  type={todos[meta.attachmentId]?.[index] ? 'secondary' : undefined}
                                  delete={todos[meta.attachmentId]?.[index]}
                                >
                                  {item.title}
                                </Typography.Text>
                              }
                              avatar={
                                <CheckCircleTwoTone
                                  style={{ fontSize: 20 }}
                                  twoToneColor={
                                    todos[meta.attachmentId]?.[index] ? '#52c41a' : '#ccc'
                                  }
                                />
                              }
                              description={item.desc}
                            />
                          </List.Item>
                        )}
                      />
                    </TabPane>
                  );
                })}
            </Tabs>
          ),
        }}
      ></OSDialog>
    </>
  );
};

export default OSBattleTableUpload;

export const OSBattleTableUploadSettings: React.FC<OSBattleTableUploadType['settings']> = () => (
  <></>
);
export const OSBattleTableUploadRequests: React.FC<OSBattleTableUploadType['requests']> = () => (
  <></>
);
