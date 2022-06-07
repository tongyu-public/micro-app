import routes from '@/../config/routes';
import { Footer } from '@/components/footer';
import { QIANKUN_GLOBAL, TOKEN_FIELD } from '@/constants/login';
// import { getTongyuUserInfo } from '@/helpers';
import {
  FundProjectionScreenOutlined,
  InsertRowBelowOutlined,
  NodeIndexOutlined,
  PayCircleOutlined,
  ReadOutlined,
  SettingOutlined,
  FolderOpenOutlined,
  UserSwitchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CompassOutlined,
  PropertySafetyOutlined,
} from '@ant-design/icons';
import type { MenuDataItem } from '@ty-one-components/frame';
import ProLayout, { DefaultFooter, ProBreadcrumb } from '@ty-one-components/frame';
import { Input, Row } from '@ty/antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import store from 'store2';
import type { Location } from 'umi';
import { history, useIntl } from 'umi';
import './content.less';
import { RightContent } from './right-content';
import { logout } from './_helpers';
// import { UserInfoModel } from './_models/user-info';

const iconMaps = {
  InsertRowBelowOutlined: <InsertRowBelowOutlined />,
  FundProjectionScreenOutlined: <FundProjectionScreenOutlined />,
  NodeIndexOutlined: <NodeIndexOutlined />,
  PayCircleOutlined: <PayCircleOutlined />,
  ReadOutlined: <ReadOutlined />,
  FolderOpenOutlined: <FolderOpenOutlined />,
  SettingOutlined: <SettingOutlined />,
  UserSwitchOutlined: <UserSwitchOutlined />,
  CompassOutlined: <CompassOutlined />,
  PropertySafetyOutlined: <PropertySafetyOutlined />,
};

const Content: React.FC<{
  location: Location;
}> = (props) => {
  // const { setUsername } = UserInfoModel.useContainer();
  const [keyWord, setKeyWord] = useState('');
  const { formatMessage } = useIntl();
  const [collapsed, setCollapsed] = useState(false);
  const isSlaveApp = window[QIANKUN_GLOBAL.IS_SLAVE_APP];
  const fromBctPage = window[QIANKUN_GLOBAL.FROM_PAGE];

  // const tongyuUserInfo = getTongyuUserInfo();

  // const { permissions } = tongyuUserInfo;

  useEffect(() => {
    if (isSlaveApp) {
      return;
    }
    if (store.get(TOKEN_FIELD) == null) {
      logout();
    }
  }, []);

  const loopMenuItem = (menus: MenuDataItem[] = []): MenuDataItem[] => {
    return menus
      .map((item) => {
        // if (permissions?.[item.name ?? '']) {
        if (item.routes) {
          return {
            ...item,
            routes: loopMenuItem(item.routes),
            icon: typeof item.icon === 'string' ? iconMaps[item.icon] : item.icon,
            hideInMenu: !!(process.env.NODE_ENV === 'production' && item.hideInMenuWhenProduction),
          };
        }
        return {
          ...item,
          icon: typeof item.icon === 'string' ? iconMaps[item.icon] : item.icon,
          hideInMenu: !!(process.env.NODE_ENV === 'production' && item.hideInMenuWhenProduction),
        };
        // }
        // return null;
      })
      .filter((item) => item) as MenuDataItem[];
  };

  const filterByMenuDate = (data: MenuDataItem[], keyWord_: string): MenuDataItem[] =>
    data
      .map((item) => {
        if (
          (item.locale &&
            formatMessage({
              id: item.locale,
              defaultMessage: item.name,
            }).includes(keyWord_)) ||
          filterByMenuDate(item.routes || [], keyWord_).length > 0
        ) {
          return {
            ...item,
            routes: filterByMenuDate(item.routes || [], keyWord_),
          };
        }

        return undefined;
      })
      .filter((item) => item) as MenuDataItem[];

  if (isSlaveApp && fromBctPage) {
    return <div>{props.children}</div>;
  }

  return (
    <div
      className={classNames('swap-admin-layout-wrapper', {
        isSlaveApp,
      })}
    >
      <ProLayout
        fixSiderbar={!isSlaveApp}
        collapsed={collapsed}
        collapsedButtonRender={
          isSlaveApp
            ? false
            : (collapsed_) => (collapsed_ ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)
        }
        menuHeaderRender={(logo, title) => {
          return isSlaveApp ? null : [logo, title];
        }}
        menuExtraRender={({ collapsed: collapsed_ }) =>
          !collapsed_ && (
            <Input.Search
              style={{ width: '100%' }}
              onSearch={(e) => {
                setKeyWord(e);
              }}
              allowClear
              placeholder="请输入关键字"
            />
          )
        }
        route={{
          path: '/',
          routes: loopMenuItem(routes.find((item) => item.path === '/')?.routes),
        }}
        location={{
          pathname: props.location.pathname,
        }}
        formatMessage={formatMessage}
        title={isSlaveApp ? false : '收益凭证系统'}
        logo={isSlaveApp ? null : '/logo.svg'}
        headerContentRender={() => {
          return isSlaveApp ? (
            <Row justify="start" align="middle">
              <div
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'inline-block',
                  marginRight: '15px',
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
              <ProBreadcrumb />
            </Row>
          ) : (
            <ProBreadcrumb />
          );
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '主页',
          },
          ...routers,
        ]}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              history.push(item.path || '/welcome');
            }}
          >
            {dom}
          </a>
        )}
        onCollapse={setCollapsed}
        rightContentRender={() => (isSlaveApp ? null : <RightContent />)}
        footerRender={() =>
          isSlaveApp ? (
            <DefaultFooter
              copyright={`Tongyu All Rights Reserved 上海同余信息科技有限公司 沪ICP备16043748号`}
            />
          ) : (
            <Footer />
          )
        }
        postMenuData={(menus) => filterByMenuDate(menus || [], keyWord)}
      >
        {props.children}
      </ProLayout>
    </div>
  );
};

export default Content;
