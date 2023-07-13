import React from 'react';
import {Button, Checkbox, Form, Input, Typography} from 'antd';
import {z} from 'zod';
import type {ValidateErrorEntity} from 'rc-field-form/lib/interface';
import {signIn} from 'next-auth/react';
import Image from 'next/image';
import CustomDivider from '../../../components/CustomDivider/CustomDivider';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
  remember: z.boolean(),
});

type User = z.infer<typeof loginSchema>;
const {Paragraph, Title} = Typography;

const SignIn = () => {
  const onFinish = (values: User) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<User>) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <Title level={1} className="text-2xl font-bold mb-4">
        Sign In
      </Title>
      <Paragraph>Start managing you projects more effeciently</Paragraph>
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
          Sign In
        </Button>
        <div className="flex items-center justify-center my-4">
          <CustomDivider />
          <p className="w-100 text-center">Or With</p>
          <CustomDivider />
        </div>
        <div className="w-full flex justify-center mx-auto">
          <Button
            className="flex items-center justify-center gap-1-2"
            onClick={() => void signIn('google', {callbackUrl: '/w/home'})}
          >
            <Image src="/google.webp" width={16} height={16} alt="google" />
            <p>Sign In with Google</p>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SignIn;
