import type { OSFormAPI } from '@ty-one-start/one-start';
import { OSConfigProviderWrapper, OSDialog, OSForm, OSTrigger } from '@ty-one-start/one-start';
import { Alert } from '@ty/antd';
import React, { useImperativeHandle, useMemo, useRef } from 'react';
import type { OSActionsOperateAPI, OSActionsOperateType } from './_typings';

const OSActionsOperate: React.ForwardRefRenderFunction<
  OSActionsOperateAPI,
  OSActionsOperateType
> = (props, ref) => {
  const { settings, requests } = props;
  const {
    formSettings,
    triggerButtonText,
    modalTitle,
    triggerButtonSettings,
    alert,
    danger: comfirmDanger,
    modalOperationSettings,
    modalType: comfirmType,
    triggerButtonType,
    triggerButtonDanger,
    actions,
    resetForm,
  } = settings ?? {};
  const { requestAfterCancel, requestAfterConfirm, requestDataSource, requestInitialValues } =
    requests ?? {};
  const formRef = useRef<OSFormAPI>(null);

  useImperativeHandle(ref, () => {
    return {
      setFieldsValue: (value) => formRef.current?.setFieldsValue(value),
      getFieldsValue: ((nameList, filterFunc) =>
        formRef.current?.getFieldsValue(nameList, filterFunc)) as OSFormAPI['getFieldsValue'],
    };
  });

  const dialogActions = useMemo(() => {
    const normalizeActions =
      typeof actions === 'function'
        ? actions({
            formRef,
          })
        : actions;

    if (resetForm) {
      return (normalizeActions ?? []).concat(
        <OSTrigger
          type="button"
          settings={{
            text: '重置',
          }}
          onClick={() => {
            formRef.current?.resetFields();
          }}
        ></OSTrigger>,
      );
    }
    return normalizeActions;
  }, [actions, resetForm]);

  return (
    <OSDialog
      type="modal-operation"
      settings={{
        ...modalOperationSettings,
        actions: dialogActions ?? modalOperationSettings?.actions,
        type: comfirmType ?? modalOperationSettings?.type,
        title: modalTitle ?? modalOperationSettings?.title,
        danger: comfirmDanger ?? modalOperationSettings?.danger,
        content: (
          <OSConfigProviderWrapper>
            {alert && <Alert style={{ marginBottom: formSettings ? 10 : 0 }} {...alert} />}
            <OSForm
              ref={formRef}
              settings={formSettings}
              requests={{
                requestDataSource,
                requestInitialValues,
              }}
            />
          </OSConfigProviderWrapper>
        ),
      }}
      requests={{
        requestAfterConfirm:
          requestAfterConfirm &&
          (async () => {
            const result = await formRef.current?.validate();
            if (result?.error) {
              return true;
            }
            return requestAfterConfirm({
              values: result?.data,
            });
          }),
        requestAfterCancel:
          requestAfterCancel &&
          (async () => {
            const result = await formRef.current?.validate();
            if (result?.error) {
              return false;
            }
            return requestAfterCancel({
              values: result?.data,
            });
          }),
      }}
    >
      <OSTrigger
        type="button"
        settings={{
          text: triggerButtonText,
          ...triggerButtonSettings,
          danger: triggerButtonDanger ?? triggerButtonSettings?.danger,
          type: triggerButtonType ?? triggerButtonSettings?.type,
        }}
      />
    </OSDialog>
  );
};

export default React.forwardRef(OSActionsOperate);

export const ActionsOperateSettings: React.FC<OSActionsOperateType['settings']> = () => <></>;
export const ActionsOperateRequests: React.FC<OSActionsOperateType['requests']> = () => <></>;
export const ActionsOperateAPI: React.FC<OSActionsOperateAPI> = () => <></>;
