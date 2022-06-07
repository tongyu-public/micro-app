import { UploadOutlined } from '@ant-design/icons';
import { Upload } from '@ty/antd';
import type { RcFile } from '@ty/antd/lib/upload';
import React, { useState } from 'react';

export default (props: { onSelectedFile: (file: RcFile) => void }) => {
  const [active, setActive] = useState(false);

  return (
    <Upload
      fileList={[]}
      beforeUpload={(file) => {
        props.onSelectedFile(file);

        return false;
      }}
    >
      <UploadOutlined
        style={{ color: active ? '#000' : '#888' }}
        onMouseOver={() => {
          if (!active) {
            setActive(true);
          }
        }}
        onMouseLeave={() => {
          setActive(false);
        }}
        onClick={() => {}}
      />
    </Upload>
  );
};
