import type React from 'react';
import { useMemo, useState } from 'react';
import store from 'store2';
import type { OSFormAPI } from '@ty-one-start/one-start';

export const useLocalData = ({
  unionId,
  formRef,
}: {
  unionId: string;
  formRef: React.RefObject<OSFormAPI>;
}) => {
  const formSaveKey = useMemo(() => {
    return `${unionId}_save_form_values`;
  }, [unionId]);

  const formSaveTimeKey = useMemo(() => {
    return `${unionId}_save_form_values_time`;
  }, [unionId]);

  const [visible, setVisible] = useState(
    !!(store.get(formSaveKey, false) && store.get(formSaveTimeKey, false)),
  );

  const [latestSaveTime, setLatestSaveTime] = useState<string | null | undefined>(
    store.get(formSaveTimeKey),
  );

  const removeLocalData = () => {
    setLatestSaveTime(undefined);
    store.remove(formSaveKey);
    store.remove(formSaveTimeKey);
  };

  const removeData = () => {
    removeLocalData();

    setVisible(false);
    formRef.current?.resetFields();
  };

  return {
    removeLocalData,
    removeData,
    latestSaveTime,
    setLatestSaveTime,
    visible,
    setVisible,
    formSaveKey,
    formSaveTimeKey,
  };
};
