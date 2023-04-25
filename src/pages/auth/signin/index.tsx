import React from 'react';
import {Button, Checkbox, Form, Input} from 'antd';
import {z} from 'zod';
import type {ValidateErrorEntity} from 'rc-field-form/lib/interface';
import {signIn} from 'next-auth/react';
import CustomDivider from '../../../components/CustomDivider/CustomDivider';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
  remember: z.boolean(),
});

type User = z.infer<typeof loginSchema>;

const SignIn = () => {
  const onFinish = (values: User) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<User>) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <p className="text-gray-500 mb-4">
        Please fill in this form to create an account!
      </p>
      <Form
        name="basic"
        layout="vertical"
        style={{minWidth: '400px'}}
        initialValues={{remember: true}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          required
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{required: true, message: 'Please input your password!'}]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Button type="primary" htmlType="submit" className="w-100">
          Sign Up
        </Button>
        <div className="flex items-center justify-center my-4">
          <CustomDivider />
          <p className="w-100 text-center">Or With</p>
          <CustomDivider />
        </div>
        <div className="w-full mx-auto">
          <Button
            type="primary"
            onClick={() => void signIn('google', {callbackUrl: '/'})}
          >
            Login with google
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SignIn;
