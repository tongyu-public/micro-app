import store from 'store2';

export const getTongyuUserInfo = () => {
  const tongyuUserInfo: {
    permissions: Record<string, boolean>;
    token: string;
    roleName: [];
  } = store.get('tongyu_USER_LOCAL_FIELD', {});

  return tongyuUserInfo;
};

// 申万监管检查：将操作用户、发起人、经办/复核人等字段为script和operation的修改为200700
export const modifyUserNameSW = (data: any, key: string, supervise?: boolean) => {
  const userName = data?.[key] as string;
  if (supervise && ['script', 'operation'].includes(userName?.toLocaleLowerCase())) {
    return '200700';
  }
  return userName;
};
