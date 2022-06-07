import { useState } from 'react';
import { createContainer } from 'unstated-next';

const useUserInfo = () => {
  const [username, setUsername] = useState();
  return {
    username,
    setUsername,
  };
};

export const UserInfoModel = createContainer(useUserInfo);
