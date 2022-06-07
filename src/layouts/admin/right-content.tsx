import { UserInfoModel } from './_models/user-info';
import { UserOutlined } from '@ant-design/icons';
import { OSTrigger } from '@ty-one-start/one-start';
import { Avatar, Col, Row } from '@ty/antd';
import { logout } from './_helpers';

export const RightContent = () => {
  const { username } = UserInfoModel.useContainer();
  return (
    <Row gutter={5}>
      {username ? (
        <Col>
          <OSTrigger
            type="button"
            settings={{
              text: '退出登录',
              type: 'text',
            }}
            onClick={() => {
              logout();
            }}
          />
        </Col>
      ) : null}
      <Col>
        <Avatar shape="square" size="small" icon={<UserOutlined />} style={{ marginRight: 10 }} />
        <span>{username}</span>
      </Col>
    </Row>
  );
};
