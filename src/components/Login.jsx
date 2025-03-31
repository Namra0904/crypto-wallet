import React, { useState, useContext } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./WalletProvider";
import { loadDecryptedWallet } from "../services/utils";

const { Title, Text } = Typography;

const PasswordVerification = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { wallet, unlockWallet,setWallet } = useWallet();

  const onFinish = async (values) => {
    setLoading(true);

    if (localStorage.getItem("wallet_details")) {
      loadDecryptedWallet(values.password)
        .then(setWallet)
        .catch(() => console.log("Failed to load wallet"));

    } else {

      navigate("/recover");
      message.error("Cannot decrypt key. Please use recovery phrases!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <Title level={3} className="mb-2 text-white">Welcome Back!</Title>
        <Text className="text-lg text-gray-300">Enter your password to unlock your wallet.</Text>
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
            name="password"
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