import { Input, Form, Button } from "antd";
import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import withAuth from "~/hocs/withAuth";
import {
  changePassword,
  logout,
  setMessage,
  useAppDispatch,
  useAppSelector,
} from "~/redux";

const ChangePasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

interface ChangePasswordPayload {
  password: string;
  newPassword: string;
  reNewPassword: string;
}

const ChangePassword = () => {
  const login = useAppSelector((state) => state.login);
  const dispatch = useAppDispatch();

  const onFinish = async (values: ChangePasswordPayload) => {
    const { password, newPassword, reNewPassword } = values;

    if (newPassword !== reNewPassword) {
      dispatch(setMessage("Password not match"));
      return;
    }

    const result = await dispatch(changePassword({ password, newPassword }));

    if (changePassword.fulfilled.match(result)) {
      toast("Password changed successfully", {
        type: "success",
        position: "bottom-right",
      });
      dispatch(logout());
      window.location.href = "/login";
    }
  };

  return (
    <ChangePasswordContainer>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="reNewPassword"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <div>{login.message}</div>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </ChangePasswordContainer>
  );
};

export default withAuth(ChangePassword);
