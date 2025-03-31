import React, { useState } from "react";
import {
  // Card,
  Button,
  Typography,
  Divider,
  Input,
  Form,
  Checkbox,
  Steps,
  Select,
  Alert,
  Row,
  Col,
} from "antd";
import {
  InfoCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  CopyOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { hasKey, newWallet } from "../services/utils";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Step } = Steps;

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [passwordForm] = Form.useForm();
  const [selectedWords, setSelectedWords] = useState({});
  const [verificationError, setVerificationError] = useState(false);
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const navigate = useNavigate();

  // Mock recovery phrase
  const [recoveryPhrase, setRecoveryPhrase] = useState([]);

  // Positions to verify (random 3 words)
  const verificationPositions = [1, 5, 9]; // Positions to verify (1-based index)

  const onPasswordFinish = async (values) => {
    const password = values.confirmPassword;
    newWallet(password)
      .then((val) => {
        setRecoveryPhrase(val.split(" "));
        setCurrentStep(1);
      })
      .catch((val) => {
        console.log(val);
      });
  };

  const handleWordSelect = (position, value) => {
    setSelectedWords((prev) => ({ ...prev, [position]: value }));
    setVerificationError(false);
  };

  const verifyRecoveryPhrase = () => {
    const allCorrect = verificationPositions.every((pos) => {
      return selectedWords[pos] === recoveryPhrase[pos - 1];
    });

    if (allCorrect) {
      console.log("Verification successful!");
      navigate("/dashboard");
    } else {
      setVerificationError(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recoveryPhrase.join(" "));
    message.success("Recovery phrase copied to clipboard!");
  };

  const toggleRecoveryPhrase = () => {
    setShowRecoveryPhrase(!showRecoveryPhrase);
  };

  const steps = [
    {
      title: "",
      content: (
        <>
          <div className="mb-6">
            <Title level={3} className="text-center mb-2 mt-5">
              Create password
            </Title>
            <Text type="secondary" className="block text-center">
              This password will unlock your wallet only on this device. We
              cannot recover this password.
            </Text>
          </div>

          <Divider />

          <Form form={passwordForm} onFinish={onPasswordFinish}>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="New password (8 characters min)"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="mb-4"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Confirm password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="mb-4"
              />
            </Form.Item>

            <Form.Item
              name="acknowledge"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("You must acknowledge this"),
                },
              ]}
            >
              <Checkbox>
                I understand that this wallet cannot recover this password for
                me.{" "}
                <a href="#" className="text-blue-500">
                  Learn more
                </a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="h-12 font-medium"
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      title: "",
      content: (
        <>
          <Title level={3} className="text-center mb-2 mt-5">
            Write down your Secret Recovery Phrase
          </Title>
          <Text type="secondary" className="block text-center mb-4">
            Write down this 12-word Secret Recovery Phrase and save it in a
            place that you trust and only you can access.
          </Text>

          <div className="text-xs text-gray-500 mb-6">
            <p>Tips:</p>
            <ul className="list-disc list-inside">
              <li>Write down and store in multiple secret places</li>
              <li>Store in a safe deposit box</li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {recoveryPhrase.map((word, index) => (
              <div
                key={index}
                className={`p-2 border rounded-lg text-center text-white border-gray-300 ${!showRecoveryPhrase ? "filter blur-md" : ""
                  }`}
              >
                {showRecoveryPhrase ? (
                  <>
                    {index + 1}. {word}
                  </>
                ) : (
                  <>{index + 1}. ******</>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <Button
              icon={
                showRecoveryPhrase ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
              type="text"
              className="text-gray-500"
              onClick={toggleRecoveryPhrase}
            >
              {showRecoveryPhrase ? "Hide seed phrase" : "Show seed phrase"}
            </Button>
            <Button
              icon={<CopyOutlined />}
              type="text"
              className="text-gray-500"
              onClick={copyToClipboard}
              disabled={!showRecoveryPhrase}
            >
              Copy to clipboard
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              type="primary"
              size="large"
              className="w-40 h-12 font-medium"
              onClick={() => setCurrentStep(2)}
              disabled={!showRecoveryPhrase}
            >
              {showRecoveryPhrase ? "Next" : "Next"}
            </Button>
          </div>
        </>
      ),
    },
    {
      title: "",
      content: (
        <>
          <Title level={3} className="text-center mb-2 mt-5">
            Confirm Your Recovery Phrase
          </Title>
          <Text type="secondary" className="block text-center mb-6">
            Please select the correct words to verify your recovery phrase
          </Text>

          {verificationError && (
            <Alert
              message="Incorrect words selected. Please try again."
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <div className="mb-6">
            {verificationPositions.map((position) => (
              <Row key={position} gutter={16} align="middle" className="mb-4">
                <Col span={12}>
                  <Text>Word {position}:</Text>
                </Col>
                <Col span={18}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder={`Select word ${position}`}
                    onChange={(value) => handleWordSelect(position, value)}
                    value={selectedWords[position] || undefined}
                  >
                    {recoveryPhrase.map((word, index) => (
                      <Select.Option key={index} value={word}>
                        {word}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            ))}
          </div>

          <div className="flex justify-between gap-4">
            <Button
              size="large"
              className="w-40 h-12 font-medium"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>
            <Button
              type="primary"
              size="large"
              className="w-40 h-12 font-medium"
              onClick={verifyRecoveryPhrase}
              disabled={
                Object.keys(selectedWords).length !==
                verificationPositions.length
              }
            >
              Verify
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      {/* <Card className="w-full max-w-lg shadow-md rounded-xl p-6"> */}
      <Steps current={currentStep} className="mb-8" type="inline">
        {hasKey() ? (
          "Token already provided!"
        ) : (
          <>
            {steps.map((item, index) => (
              <Step key={index} />
            ))}
          </>
        )}
      </Steps>

      {steps[currentStep].content}
      {/* </Card> */}
    </div>
  );
};

export default OnboardingFlow;
