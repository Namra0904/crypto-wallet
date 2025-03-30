import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loadDecryptedWallet } from "../utils";

const { Title, Text } = Typography;

const PasswordVerification = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    if (localStorage.getItem("wallet_details")) {
      loadDecryptedWallet(values.password)
        .then((val) => {
          navigate("/dashboard");
          console.log(val);
          setLoading(false);
        })
        .catch((val) => {
          console.log(val);
          setLoading(false);
          message.error("Password not true");
        });
    } else {
      navigate("/recover");
      message.error("Cant decrypt key please use phrases!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <Title level={3} className="mb-2 text-white">
          Welcome Back!
        </Title>
        <Text className="text-lg text-gray-300"></Text>
      </div>
      <Form
        name="password_verification"
        onFinish={onFinish}
        layout="vertical"
        className="w-full max-w-md"
      >
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter your password"
            size="large"
            className="bg-gray-700 border-gray-600 text-white"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="bg-blue-600 hover:bg-blue-700 h-12"
          >
            Unlock Wallet
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PasswordVerification;
