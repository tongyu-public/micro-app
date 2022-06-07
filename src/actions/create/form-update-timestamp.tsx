/* eslint-disable consistent-return */
import { CloseOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Typography } from '@ty/antd';
import utl from 'lodash';
import React, { useEffect, useImperativeHandle, useLayoutEffect } from 'react';
import store from 'store2';
import type { OSFormAPI, RecordType } from '@ty-one-start/one-start';
import type { OSActionsCreateType } from '@/actions';

export type FormUpdateTimestampProps = {
  formRef: React.RefObject<OSFormAPI>;
  dialogVisible: boolean;
  type?: Required<OSActionsCreateType>['settings']['type'];
  removeLocalData: () => void;
  removeData: () => void;
  latestSaveTime: string | null | undefined;
  setLatestSaveTime: React.Dispatch<any>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  formSaveKey: string;
  formSaveTimeKey: string;
};

export type FormUpdateTimestampAPI = {
  updateLocalData?: (values?: RecordType) => void;
  removeLocalData?: () => void;
  removeData?: () => void;
};

const FormUpdateTimestamp: React.ForwardRefRenderFunction<
  FormUpdateTimestampAPI,
  FormUpdateTimestampProps
> = (
  {
    formRef,
    dialogVisible,
    type,
    setLatestSaveTime,
    setVisible,
    formSaveKey,
    formSaveTimeKey,
    removeLocalData,
    removeData,
    visible,
    latestSaveTime,
  },
  ref,
) => {
  const updateLocalData = utl.debounce((values?: RecordType) => {
    const saveTimeStr = new Date().toLocaleTimeString();
    setLatestSaveTime(saveTimeStr);
    setVisible(true);
    store.set(formSaveKey, values);
    store.set(formSaveTimeKey, saveTimeStr);
  }, 450);

  useImperativeHandle(ref, () => ({
    updateLocalData,
    removeLocalData,
    removeData,
  }));

  useLayoutEffect(() => {
    if (type === 'modal' && dialogVisible) {
      const localValues = store.get(formSaveKey);
      if (localValues) {
        formRef.current?.setFieldsValue(localValues);
      }
    }
  }, [dialogVisible, formRef, type, formSaveKey]);

  useEffect(() => {
    if (type === 'plain') {
      const localValues = store.get(formSaveKey);
      if (localValues) {
        formRef.current?.setFieldsValue(localValues);
      }
    }
  }, [type, formSaveKey, formRef]);

  return (
    <Tag
      closable
      visible={visible}
      closeIcon={
        <Tooltip title="清空最近保存数据，将重置当前表单">
          <CloseOutlined />
        </Tooltip>
      }
      onClose={() => {
        removeData();
      }}
    >
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        最后保存: {latestSaveTime ?? '--'}
      </Typography.Text>
    </Tag>
  );
};

export default React.forwardRef(FormUpdateTimestamp);
