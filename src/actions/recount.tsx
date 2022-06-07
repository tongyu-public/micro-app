import { CloseOutlined } from '@ant-design/icons';
import type { OSDialogAPI, OSDialogModalOperationAPI, OSFormAPI } from '@ty-one-start/one-start';
import {
  normalizeRequestOutputs,
  OSConfigProviderWrapper,
  OSDialog,
  OSForm,
  OSReferencesGlobalContext,
  OSTrigger,
  useActionsRef,
  useLoading,
} from '@ty-one-start/one-start';
import { Badge, Row, Space, Typography } from '@ty/antd';
import delay from 'delay';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { OSActionsRecountAPI, OSActionsRecountType } from './_typings';

const OSActionsRecount: React.ForwardRefRenderFunction<
  OSActionsRecountAPI,
  OSActionsRecountType
> = (props) => {
  const { settings, requests } = props;
  const {
    formSettings,
    triggerButtonText = '重新计算',
    modalTitle = '重新计算',
    triggerButtonSettings,
    getCurrentStateInterval = 5000,
    triggerButtonType = 'primary',
  } = settings ?? {};
  const { requestRecount, requestCurrentStatus } = requests ?? {};
  const formRef = useRef<OSFormAPI>(null);

  const globalRefsRef = useContext(OSReferencesGlobalContext);
  const dialogRef = useRef<OSDialogModalOperationAPI>(null);
  const dialogPopoverRef = useRef<OSDialogAPI>(null);

  const [recountingStatus, setRecountingStatus] = useState<number>();
  const [triggerDate, setTriggerDate] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const backEndSyncRef = useRef(false);
  const dialogingRef = useRef(false);

  /** 默认为 true 解决 button 瞬间切换 disabled 的样式问题 */
  const syncStatusLoading = useLoading(true);

  const syncStatus = useCallback(async () => {
    if (!requestCurrentStatus || dialogingRef.current) return;

    syncStatusLoading.setLoading(true);
    await delay(1000);
    const { error, data } = await requestCurrentStatus().then(normalizeRequestOutputs);
    syncStatusLoading.setLoading(false);
    if (error) return;

    backEndSyncRef.current = true;

    if (data?.recountingStatus != null) {
      setRecountingStatus(data.recountingStatus);
    }

    if (data?.triggerDate) {
      setTriggerDate(data.triggerDate);
    }

    if (data?.errorMessage) {
      setErrorMessage(data?.errorMessage);
    }
  }, [requestCurrentStatus, syncStatusLoading]);

  const actionsRef = useActionsRef({
    syncStatus,
    getGetCurrentStateInterval: () => getCurrentStateInterval,
  });

  const prevResultDom = useMemo(() => {
    if (recountingStatus === 0) {
      return (
        <Space direction="vertical">
          <Space>
            <Typography.Text>状态:</Typography.Text>
            <Badge status="success" text={'运行成功'} />
          </Space>
          <Space>
            <Typography.Text>触发时间:</Typography.Text>
            <Typography.Text>{triggerDate ?? '--'}</Typography.Text>
          </Space>
        </Space>
      );
    }
    if (recountingStatus === 2) {
      return (
        <Space direction="vertical">
          <Space>
            <Typography.Text>状态:</Typography.Text>
            <Badge status="error" text={'运行异常'} />
          </Space>
          <Space>
            <Typography.Text>触发时间:</Typography.Text>
            <Typography.Text>{triggerDate ?? '--'}</Typography.Text>
          </Space>
          <Space>
            <Typography.Text>报错信息:</Typography.Text>
            <Typography.Text
              ellipsis={{
                tooltip: errorMessage,
              }}
              style={{ width: 180 }}
            >
              {errorMessage ?? '--'}
            </Typography.Text>
          </Space>
        </Space>
      );
    }
    return null;
  }, [errorMessage, recountingStatus, triggerDate]);

  const triggerText = useMemo(() => {
    if (!backEndSyncRef.current && syncStatusLoading.loading) {
      return '同步状态中';
    }
    return triggerButtonText;
  }, [syncStatusLoading.loading, triggerButtonText]);

  const triggerDisabled = useMemo(() => {
    return !backEndSyncRef.current && syncStatusLoading.loading;
  }, [syncStatusLoading.loading]);

  useLayoutEffect(() => {
    actionsRef.current.syncStatus();

    const handle = setInterval(() => {
      actionsRef.current.syncStatus();
    }, actionsRef.current.getGetCurrentStateInterval());

    return () => {
      clearInterval(handle);
    };
  }, [actionsRef]);

  useEffect(() => {
    if (recountingStatus === 0 || recountingStatus === 2) {
      dialogPopoverRef.current?.push();
    }
  }, [recountingStatus]);

  if (recountingStatus === 1) {
    return (
      <Badge
        status="processing"
        text={`重新计算中${triggerDate ? ` (触发时间 ${triggerDate ?? '--'})` : ''}`}
      />
    );
  }

  return (
    <OSDialog
      type="popover"
      ref={dialogPopoverRef}
      settings={{
        title: (
          <Row justify="space-between" align="middle">
            <span>最近计算运行结果</span>
            <CloseOutlined
              style={{ fontSize: 12, position: 'relative', top: -2 }}
              onClick={() => {
                dialogPopoverRef.current?.pop();
              }}
            />
          </Row>
        ),
        content: <div style={{ width: 250 }}>{prevResultDom}</div>,
        placement: 'bottomRight',
      }}
    >
      <OSDialog
        ref={dialogRef}
        type="modal-operation"
        settings={{
          title: modalTitle,
          content: (
            <OSConfigProviderWrapper>
              <OSForm ref={formRef} settings={formSettings} />
            </OSConfigProviderWrapper>
          ),
        }}
        requests={{
          requestAfterConfirm:
            requestRecount &&
            (async () => {
              const result = await formRef.current?.validate();
              if (result?.error) {
                return false;
              }
              const { error, data } = await requestRecount({
                values: result?.data,
              }).then(normalizeRequestOutputs);

              if (!error) {
                globalRefsRef.current?.dialogs?.messages?.globalMessage?.push({
                  title: data?.message ?? '重新计算服务调度成功，等待计算完成',
                });

                setRecountingStatus(1);
              }

              return error;
            }),
        }}
      >
        <OSTrigger
          type="button"
          settings={{
            ...triggerButtonSettings,
            type: triggerButtonType,
            text: triggerText,
            manualPush: true,
            disabled: triggerDisabled,
          }}
          onClick={async () => {
            dialogPopoverRef.current?.pop();

            dialogingRef.current = true;
            await dialogRef.current?.push();
            dialogingRef.current = false;
          }}
        />
      </OSDialog>
    </OSDialog>
  );
};

export default OSActionsRecount;

export const ActionsRecountSettings: React.FC<OSActionsRecountType['settings']> = () => <></>;
export const ActionsRecountRequests: React.FC<OSActionsRecountType['requests']> = () => <></>;
export const ActionsRecountAPI: React.FC<OSActionsRecountAPI> = () => <></>;
