import { exportWebExcel } from '@ty-one-start/request';
import React, { useContext, useMemo, useRef, useState } from 'react';
import {
  findTreeNodeMeta,
  normalizeRequestOutputs,
  OSDialog,
  OSForm,
  OSReferencesGlobalContext,
  OSTrigger,
} from '@ty-one-start/one-start';
import type { OSDialogAPI, OSFormAPI, OSTriggerAPI, RecordType } from '@ty-one-start/one-start';
import type { OSActionsReportDownloadAPI, OSActionsReportDownloadType } from './_typings';

const OSActionsReportDownload: React.ForwardRefRenderFunction<
  OSActionsReportDownloadAPI,
  OSActionsReportDownloadType
> = (props) => {
  const { settings, requests } = props;
  const {
    modalTitle = '下载报告',
    triggerButtonSettings,
    triggerButtonText,
    triggerButtonType,
    formsSettings,
    menu,
  } = settings ?? {};
  const { requestReportDownload } = requests ?? {};
  const triggerRef = useRef<OSTriggerAPI>(null);

  const globalRefs = useContext(OSReferencesGlobalContext);

  const [key, setKey] = useState<string>();
  const dialogRef = useRef<OSDialogAPI>(null);

  const formRef = useRef<OSFormAPI>(null);
  const [reportName, setReportName] = useState<string>();

  const content = useMemo(() => {
    const formSettings = formsSettings?.[key ?? ''];
    if (formSettings) {
      return <OSForm ref={formRef} settings={formSettings} />;
    }

    return null;
  }, [formsSettings, key]);

  const downloadReport = async ({
    key: menuKey,
    values,
  }: {
    key?: string;
    values?: RecordType;
  }) => {
    if (!requestReportDownload) return false;

    const { error, data } = await requestReportDownload({ key: menuKey, values }).then(
      normalizeRequestOutputs,
    );

    if (!error && data) {
      exportWebExcel({
        fileName: data?.fileName ?? '默认文件',
        file: data?.file ?? '',
        fileType: data.fileType ?? 'file-stream',
      });

      globalRefs.current?.dialogs?.messages?.globalMessage?.push({
        title: data.message ?? '下载报告成功',
      });
    }

    return error;
  };

  return (
    <OSDialog
      ref={dialogRef}
      type="modal-operation"
      settings={{
        title: `${modalTitle}${reportName ?? ''}`,
        content,
      }}
      requests={{
        requestAfterConfirm: async () => {
          const result = await formRef.current?.validate();

          if (result?.error) return true;

          return downloadReport({ key, values: result?.data });
        },
      }}
    >
      <OSTrigger
        type="dropdown"
        ref={triggerRef}
        settings={{
          ...triggerButtonSettings,
          text: triggerButtonText,
          type: triggerButtonType,
          menu,
        }}
        requests={{
          requestAfterMenuClick: async ({ key: itemKey }) => {
            if (formsSettings) return false;
            return downloadReport({ key: itemKey });
          },
        }}
        onMenuClick={({ key: itemKey }) => {
          if (formsSettings && Object.keys(formsSettings).includes(itemKey)) {
            setKey(itemKey);
            if (menu) {
              const name = findTreeNodeMeta(menu, (item) => (item.key ?? item.text) === itemKey)
                ?.item.text;
              setReportName(typeof name === 'string' ? name : '');
            }
            dialogRef.current?.push();
          }
        }}
      />
    </OSDialog>
  );
};

export default OSActionsReportDownload;

export const ActionsReportDownloadSettings: React.FC<
  OSActionsReportDownloadType['settings']
> = () => <></>;
export const ActionsReportDownloadRequests: React.FC<
  OSActionsReportDownloadType['requests']
> = () => <></>;
export const ActionsReportDownloadAPI: React.FC<OSActionsReportDownloadAPI> = () => <></>;
