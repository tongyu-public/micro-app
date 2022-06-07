import { CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

export default (props: { onClick?: () => void }) => {
  const [active, setActive] = useState(false);

  return (
    <CloseOutlined
      style={{ color: active ? '#000' : '#888', fontSize: 12 }}
      onMouseOver={() => {
        if (!active) {
          setActive(true);
        }
      }}
      onMouseLeave={() => {
        setActive(false);
      }}
      onClick={props.onClick}
    />
  );
};
