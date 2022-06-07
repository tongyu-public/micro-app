import { FileTextOutlined } from '@ant-design/icons';
import type { OSTriggerAPI } from '@ty-one-start/one-start';
import { normalizeRequestOutputs, OSTrigger } from '@ty-one-start/one-start';
import { message, Upload } from '@ty/antd';
import type { RcFile } from '@ty/antd/es/upload/interface';
import React, { useMemo, useRef } from 'react';
import type { OSActionsTemplateUploadAPI, OSActionsTemplateUploadType } from './_typings';

const OSActionsTemplateUpload: React.ForwardRefRenderFunction<
  OSActionsTemplateUploadAPI,
  OSActionsTemplateUploadType
> = (props) => {
  const { settings, requests } = props;
  const { buttonTriggerText, templates, suffixs } = settings ?? {};
  const { requestUploadReportData, requestDownloadTemplateData } = requests ?? {};
  const triggerRef = useRef<OSTriggerAPI>(null);

  const tooltip = useMemo(() => {
    return `支持上传的文件后缀 ${suffixs?.join(', ')}`;
  }, [suffixs]);

  const uploadFile = async (file: RcFile) => {
    if (!requestUploadReportData) return;

    triggerRef.current?.setLoading(true);
    const { error } = await requestUploadReportData({
      file,
    }).then(normalizeRequestOutputs);
    triggerRef.current?.setLoading(false);

    if (!error) {
      message.success('导入模板成功');
    }
  };

  const downloadTpl = async (fileName: string, key: string) => {
    if (!requestDownloadTemplateData) return { error: false };

    const { error } = await requestDownloadTemplateData({
      fileName,
      key,
    }).then(normalizeRequestOutputs);

    if (!error) {
      message.success('下载模板成功');
    }

    return { error };
  };

  const renderUpload = (text: string = '导入模板') => {
    return (
      <Upload
        name="file"
        showUploadList={false}
        accept={suffixs?.join(',')}
        maxCount={1}
        beforeUpload={(file) => {
          uploadFile(file);
          return false;
        }}
      >
        {text}
      </Upload>
    );
  };

  return (
    <OSTrigger
      type="dropdown"
      ref={triggerRef}
      settings={{
        split: true,
        text: renderUpload(buttonTriggerText),
        menu: templates?.map((item) => {
          return {
            type: 'item',
            text: item.fileName,
            key: item.key ?? item.fileName,
            icon: <FileTextOutlined />,
          };
        }),
        tooltip,
      }}
      requests={{
        requestAfterMenuClick: async ({ key }) => {
          const findItem = templates?.find((it) => (it.key ?? it.fileName) === key);
          if (!findItem) return false;
          const { error } = await downloadTpl(findItem.fileName, key);
          return { error };
        },
      }}
    />
  );
};

export default OSActionsTemplateUpload;

export const ActionsTemplateUploadSettings: React.FC<
  OSActionsTemplateUploadType['settings']
> = () => <></>;
export const ActionsTemplateUploadRequests: React.FC<
  OSActionsTemplateUploadType['requests']
> = () => <></>;
export const ActionsTemplateUploadAPI: React.FC<OSActionsTemplateUploadAPI> = () => <></>;
