import { UserInfoModel } from './_models/user-info';
import React from 'react';
import type { Location } from 'umi';
import Content from './content';

const Layout: React.FC<{
  location: Location;
}> = (props) => {
  return (
    <UserInfoModel.Provider>
      <Content location={props.location}>{props.children}</Content>
    </UserInfoModel.Provider>
  );
};

export default Layout;
