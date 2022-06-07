/* eslint-disable consistent-return */
import { Affix, Col, Row, Space } from '@ty/antd';
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  globalRefKeys,
  normalizeRequestOutputs,
  OSDialog,
  OSForm,
  OSReferencesCollectorProviderWrapper,
  OSTable,
  OSTrigger,
  useRefsRef,
} from '@ty-one-start/one-start';
import type {
  OSCustomFieldStaticPureTableFormFieldItemConfigsType,
  OSDialogModalAPI,
  OSFormAPI,
  OSTableRequestDataSourceParams,
} from '@ty-one-start/one-start';
import type { ApplyingTemplateAPI } from './applying-template';
import ApplyingTemplate from './applying-template';
import type { FormUpdateTimestampAPI } from './form-update-timestamp';
import FormUpdateTimestamp from './form-update-timestamp';
import { useLocalData } from './use-local-data';
import type { OSActionsCreateAPI, OSActionsCreateType } from '../_typings';
import { Alert } from '@ty/antd';

const OSActionsCreate: React.ForwardRefRenderFunction<OSActionsCreateAPI, OSActionsCreateType> = (
  props,
  ref,
) => {
  const { settings, requests, slots } = props;
  const {
    requestTemplateCreate,
    requestTemplateList,
    requestTemplateDataSource,
    requestUpdateTemplateInfo,
    requestDeleteTemplate,
    requestApplayTemplateData,
    requestUpdateTemplateValues,
    requestCreateFormInitialValues,
  } = requests ?? {};

  const {
    templateCreateFormSettings,
    templateCreateModalSettings,
    templateSearchTableSettings,
    enablePersistence = false,
    enableTemplate = false,
    type = 'modal',
    copy = false,
  } = settings ?? {};

  const [dialogVisible, setDialogVisible] = useState(false);

  const createFormRef = useRef<OSFormAPI>(null);

  const unionId = settings?.sourceId ?? window.location.pathname;

  const {
    setLatestSaveTime,
    setVisible,
    formSaveKey,
    formSaveTimeKey,
    removeLocalData,
    removeData,
    visible,
    latestSaveTime,
  } = useLocalData({
    unionId,
    formRef: createFormRef,
  });

  const { refKeys, refsRef } = useRefsRef({
    dialogs: {
      modals: {
        createModal: 'createModal',
        tplCreate: 'tplCreate',
        tplSettings: 'tplSettings',
      },
      messages: {
        ...globalRefKeys.dialogs.messages,
      },
      popconfirms: {
        createConfirm: 'createConfirm',
      },
    },
    tables: {
      tplSettings: 'tplSettings',
    },
    forms: {
      createForm: 'createForm',
      createTpl: 'createTpl',
      editTpl: 'editTpl',
    },
    triggers: {
      buttons: {
        saveBtn: 'saveBtn',
      },
    },
  });

  useImperativeHandle(ref, () => createFormRef.current!);

  const formUpdateTimestampRef = useRef<FormUpdateTimestampAPI>(null);
  const applyingTemplateRef = useRef<ApplyingTemplateAPI>(null);

  const createFormDom = (
    <OSForm
      ref={createFormRef}
      refKey={refKeys.forms.createForm}
      settings={settings?.createFormSettings}
      onDataSourceChange={(normalizedValues) => {
        formUpdateTimestampRef.current?.updateLocalData?.(normalizedValues);
      }}
      onDataSourceLinkageChange={(normalizedValues) => {
        formUpdateTimestampRef.current?.updateLocalData?.(normalizedValues);
      }}
      requests={{
        requestInitialValues: async (params) => {
          if (requestCreateFormInitialValues) {
            return requestCreateFormInitialValues({
              ...params,
              apis: createFormRef.current!,
            });
          }
          return false;
        },
      }}
    ></OSForm>
  );

  const persistenceDom = useMemo(() => {
    if (enablePersistence) {
      return (
        <FormUpdateTimestamp
          type={type}
          dialogVisible={dialogVisible}
          ref={formUpdateTimestampRef}
          formRef={createFormRef}
          setLatestSaveTime={setLatestSaveTime}
          setVisible={setVisible}
          formSaveKey={formSaveKey}
          formSaveTimeKey={formSaveTimeKey}
          removeLocalData={removeLocalData}
          removeData={removeData}
          visible={visible}
          latestSaveTime={latestSaveTime}
        />
      );
    }
    return null;
  }, [
    enablePersistence,
    type,
    dialogVisible,
    setLatestSaveTime,
    setVisible,
    formSaveKey,
    formSaveTimeKey,
    removeLocalData,
    removeData,
    visible,
    latestSaveTime,
  ]);

  const templateSettingDom = useMemo(() => {
    return (
      <OSDialog
        type="modal"
        destroyOnClose
        refKey={refKeys.dialogs.modals.tplSettings}
        settings={{
          title: '模板设置',
          width: '50%',
          body: (
            <OSTable
              refKey={refKeys.tables.tplSettings}
              settings={{
                ...templateSearchTableSettings,
                searchFormItemChunkSize: 2,
                fieldItems: templateSearchTableSettings?.fieldItems?.concat([
                  {
                    type: 'actions',
                    settings: (params) => {
                      const tplEditModalRef = React.createRef<OSDialogModalAPI>();

                      return {
                        title: '操作',
                        dataIndex: 'actions',
                        align: 'center',
                        actions: [
                          <OSTrigger
                            type={'button'}
                            settings={{
                              text: '应用',
                              type: 'link',
                              size: 'small',
                            }}
                            requests={{
                              requestAfterClick: async () => {
                                if (!requestApplayTemplateData) return;
                                const { error, data } = await requestApplayTemplateData({
                                  ...params,
                                  apis: createFormRef.current!,
                                }).then(normalizeRequestOutputs);
                                if (error || !data) return;

                                refsRef.current?.dialogs?.messages?.globalMessage?.push({
                                  title: '应用模板数据成功',
                                });

                                applyingTemplateRef.current?.setApplyingTemplate({
                                  id: data?.templateId,
                                  name: data?.templateName,
                                });

                                refsRef.current?.dialogs?.modals?.tplSettings?.pop();
                                refsRef.current?.forms?.createForm?.resetFields();
                                refsRef.current?.forms?.createForm?.setFieldsValue(data.values);
                              },
                            }}
                          />,
                          <OSDialog
                            type="modal"
                            ref={tplEditModalRef}
                            settings={{
                              title: '模板编辑',
                              width: 350,
                              body: (
                                <OSForm
                                  refKey={refKeys.forms.editTpl}
                                  settings={{
                                    ...templateCreateFormSettings,
                                  }}
                                  requests={{
                                    requestDataSource: async () => {
                                      if (!requestTemplateDataSource) return;
                                      refsRef.current?.triggers?.buttons?.saveBtn?.update({
                                        disabled: true,
                                      });
                                      const { error, data } = await requestTemplateDataSource({
                                        ...params,
                                        apis: createFormRef.current!,
                                      }).then(normalizeRequestOutputs);
                                      refsRef.current?.triggers?.buttons?.saveBtn?.update({
                                        disabled: false,
                                      });
                                      return {
                                        error,
                                        data,
                                      };
                                    },
                                  }}
                                ></OSForm>
                              ),
                              footer: (
                                <OSTrigger
                                  type="button"
                                  refKey={refKeys.triggers.buttons.saveBtn}
                                  settings={{
                                    text: '保存',
                                    type: 'primary',
                                  }}
                                  requests={{
                                    requestAfterClick: async () => {
                                      const result =
                                        await refsRef.current?.forms?.editTpl?.validate();
                                      if (!result || result?.error) return;

                                      const { data: values } = result;

                                      if (!requestUpdateTemplateInfo) return;

                                      const { error } = await requestUpdateTemplateInfo({
                                        ...params,
                                        values,
                                        apis: createFormRef.current!,
                                      }).then(normalizeRequestOutputs);

                                      if (error) {
                                        return error;
                                      }

                                      refsRef.current?.dialogs?.messages?.globalMessage?.push({
                                        title: '保存成功',
                                      });
                                      tplEditModalRef.current?.pop();
                                      refsRef.current?.tables?.tplSettings?.reload();
                                      return false;
                                    },
                                  }}
                                ></OSTrigger>
                              ),
                            }}
                          >
                            <OSTrigger
                              type="button"
                              settings={{
                                text: '编辑',
                                type: 'link',
                                size: 'small',
                              }}
                            />
                          </OSDialog>,
                          <OSDialog
                            type="popconfirm"
                            settings={{
                              title: '确认删除吗？',
                            }}
                            requests={{
                              requestAfterConfirm: async () => {
                                if (!requestDeleteTemplate) return;
                                const { error } = await requestDeleteTemplate({
                                  ...params,
                                  apis: createFormRef.current!,
                                }).then(normalizeRequestOutputs);

                                if (error) return;

                                refsRef.current?.dialogs?.messages?.globalMessage?.push({
                                  title: '删除成功',
                                });

                                refsRef.current?.tables?.tplSettings?.reload();
                              },
                            }}
                          >
                            <OSTrigger
                              type="button"
                              settings={{
                                text: '删除',
                                type: 'link',
                                danger: true,
                                size: 'small',
                              }}
                            />
                          </OSDialog>,
                        ],
                      };
                    },
                  },
                ]),
              }}
              requests={{
                requestDataSource: async (
                  params: OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
                ) => {
                  if (!requestTemplateList) return false;

                  const { error, data } = await requestTemplateList({
                    ...params,
                    apis: createFormRef.current!,
                  }).then(normalizeRequestOutputs);

                  if (error) return true;

                  return { error, data };
                },
              }}
            ></OSTable>
          ),
        }}
      >
        <OSTrigger
          type="button"
          settings={{
            text: '模板设置',
          }}
        ></OSTrigger>
      </OSDialog>
    );
  }, [
    refKeys.dialogs.modals.tplSettings,
    refKeys.forms.editTpl,
    refKeys.tables.tplSettings,
    refKeys.triggers.buttons.saveBtn,
    refsRef,
    requestApplayTemplateData,
    requestDeleteTemplate,
    requestTemplateDataSource,
    requestTemplateList,
    requestUpdateTemplateInfo,
    templateCreateFormSettings,
    templateSearchTableSettings,
  ]);

  const templateDom = useMemo(() => {
    if (enableTemplate === false) {
      return null;
    }
    return (
      <Space>
        <ApplyingTemplate
          ref={applyingTemplateRef}
          createFormRef={createFormRef}
          requestUpdateTemplateValues={requestUpdateTemplateValues}
          onSaveTplSussecc={() => {
            refsRef.current?.dialogs?.messages?.globalMessage?.push({
              title: '保存模板成功',
            });
          }}
        />
        {templateSettingDom}
        <OSDialog
          refKey={refKeys.dialogs.modals.tplCreate}
          type="modal"
          settings={{
            title: '另存为模板',
            width: 350,
            ...templateCreateModalSettings,
            body: (
              <OSForm
                refKey={refKeys.forms.createTpl}
                settings={templateCreateFormSettings}
              ></OSForm>
            ),
            footer: (
              <Row justify="end">
                <Col>
                  <OSTrigger
                    type="button"
                    settings={{
                      type: 'primary',
                      text: '新建',
                    }}
                    requests={{
                      requestAfterClick: async () => {
                        const results = await refsRef.current?.forms?.createTpl?.validate();

                        if (!results || results.error) return;
                        if (!requestTemplateCreate) return;

                        const { error } = await requestTemplateCreate({
                          values: results.data,
                          createFormValues:
                            refsRef.current?.forms?.createForm?.getDataSource() ?? {},
                          apis: createFormRef.current!,
                        }).then(normalizeRequestOutputs);

                        if (error) return;

                        refsRef.current?.dialogs?.messages?.globalMessage?.push({
                          title: '创建成功',
                        });

                        refsRef.current?.forms?.createTpl?.resetFields();
                        refsRef.current?.dialogs?.modals?.tplCreate?.pop();
                      },
                    }}
                  ></OSTrigger>
                </Col>
              </Row>
            ),
          }}
        >
          <OSTrigger
            type="button"
            settings={{
              text: '另存为',
            }}
          ></OSTrigger>
        </OSDialog>
      </Space>
    );
  }, [
    enableTemplate,
    refKeys.dialogs.modals.tplCreate,
    refKeys.forms.createTpl,
    refsRef,
    requestTemplateCreate,
    requestUpdateTemplateValues,
    templateCreateFormSettings,
    templateCreateModalSettings,
    templateSettingDom,
  ]);

  const footerDom = (
    <Row justify="space-between">
      <Col>{persistenceDom}</Col>
      <Col>
        <Space>
          {templateDom}
          <OSTrigger
            type="button"
            settings={{
              text: '重置',
            }}
            onClick={() => {
              removeData();
            }}
          />
          {React.Children.map(slots?.renderActions?.() ?? [], (child) => child)}
          <OSTrigger
            type="button"
            settings={{
              type: 'primary',
              text: '确认',
            }}
            requests={{
              requestAfterClick: async () => {
                if (!requests?.requestCreateSource) return false;

                const result = await createFormRef.current?.validate();
                if (!result || result.error) return false;

                const { error } = await requests
                  .requestCreateSource({
                    values: result.data,
                    apis: createFormRef.current!,
                  })
                  .then(normalizeRequestOutputs);

                if (error) return true;

                refsRef.current?.dialogs?.messages?.globalMessage?.push({
                  title: '创建成功',
                });
                refsRef.current?.dialogs?.modals?.createModal?.pop();

                formUpdateTimestampRef.current?.removeData?.();

                return false;
              },
            }}
          />
        </Space>
      </Col>
    </Row>
  );

  const renderInner = () => {
    if (type === 'plain') {
      const body = (
        <div
          style={{
            marginBottom: 15,
          }}
        >
          {createFormDom}
        </div>
      );
      return (
        <div>
          {slots?.renderContent
            ? slots?.renderContent({
                formDom: body,
                type,
              })
            : body}
          <Affix offsetBottom={0}>
            <div
              style={{
                padding: '10px 0',
                background: '#fff',
                borderTop: '1px solid #f0f0f0',
              }}
            >
              {footerDom}
            </div>
          </Affix>
        </div>
      );
    }

    const body = (
      <>
        {copy && (
          <Alert
            message="【交易簿】【交易对手】需要修改"
            style={{
              textAlign: 'center',
            }}
            type="info"
            showIcon
            closable
            banner={true}
          />
        )}
        {createFormDom}
      </>
    );

    return (
      <OSDialog
        refKey={refKeys.dialogs.modals.createModal}
        type="modal"
        onVisibleChange={(next) => {
          setDialogVisible(next);
        }}
        settings={{
          ...settings?.createModalDialogSettings,
          body: slots?.renderContent
            ? slots?.renderContent({
                formDom: body,
                type,
              })
            : body,
          footer: footerDom,
        }}
      >
        <OSTrigger
          type="button"
          settings={{
            text: '创建',
            type: 'primary',
            ...settings?.createTriggerSettings,
          }}
        />
      </OSDialog>
    );
  };

  return (
    <OSReferencesCollectorProviderWrapper ref={refsRef}>
      {renderInner()}
    </OSReferencesCollectorProviderWrapper>
  );
};

export default React.forwardRef(OSActionsCreate);

export const ActionsCreateSettings: React.FC<OSActionsCreateType['settings']> = () => <></>;
export const ActionsCreateRequests: React.FC<OSActionsCreateType['requests']> = () => <></>;
export const ActionsCreateAPI: React.FC<OSActionsCreateAPI> = () => <></>;
