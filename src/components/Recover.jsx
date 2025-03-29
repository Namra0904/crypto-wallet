import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Divider,
  Input,
  Form,
  Checkbox,
  Steps,
} from "antd";
import {
  InfoCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Step } = Steps;

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [recoveryForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isRecoveryComplete, setIsRecoveryComplete] = useState(false);
  const [formValues, setFormValues] = useState({});

  // Watch form values changes
  useEffect(() => {
    const values = recoveryForm.getFieldsValue();
    const allFieldsFilled = [...Array(12)].every((_, index) => {
      return values[`word-${index + 1}`]?.trim();
    });
    setIsRecoveryComplete(allFieldsFilled);
  }, [formValues]);

  const onRecoveryFinish = (values) => {
    console.log("Recovery values:", values);
    setCurrentStep(1);
  };

  const onPasswordFinish = (values) => {
    console.log("Password values:", values);
    const recoveryValues = recoveryForm.getFieldsValue();
    console.log("Complete submission:", { ...recoveryValues, ...values });
    // Proceed with wallet creation/import
  };

  const handleValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const steps = [
    {
      title: "",
      content: (
        <div className="mb-6">
          <Title level={3} className="text-center mb-2 mt-5">
            Access your wallet with your Secret Recovery Phrase
          </Title>
          <Text type="secondary" className="block text-center mb-4">
            MetaMask cannot recover your password. We will use your Secret
            Recovery Phrase to validate your ownership, restore your wallet, and
            set up a new password.
          </Text>
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            className="text-blue-500 hover:text-blue-700 p-0"
          >
            Learn more
          </Button>

          <Divider />

          <Title level={4} className="mb-6">
            Type your Secret Recovery Phrase
          </Title>

          <Text className="block mb-6">
            You can paste your entire secret recovery phrase into any field
          </Text>

          <Form
            form={recoveryForm}
            onFinish={onRecoveryFinish}
            // layout="inline"
                  onValuesChange={handleValuesChange}
                
          >
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[...Array(12)].map((_, index) => (
                <Form.Item
                  key={index}
                  name={`${index + 1}`}
                  label={`${index + 1}`}
                      className=""
                        style={{marginBottom:"0"}}
                >
                  <Input
                    size=""
                    className="w-full"
                    placeholder={`Word ${index + 1}`}
                  />
                </Form.Item>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="w-40 h-12 font-medium"
                disabled={!isRecoveryComplete}
              >
                Continue
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
    {
      title: "",
      content: (
        <div className="mb-6">
          <Title level={3} className="text-center mb-2">
            Create password
          </Title>
          <Text type="secondary" className="block text-center">
            This password will unlock your wallet only on this device. We cannot
            recover this password.
          </Text>

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

            <div className="flex justify-between">
              <Button
                size="large"
                className="w-40 h-12 font-medium"
                onClick={() => setCurrentStep(0)}
              >
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-40 h-12 font-medium"
              >
                Import my wallet
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* <Card className="w-full max-w-lg shadow-md rounded-xl p-6"> */}
        <div >
          <Steps current={currentStep} className="mb-8" type="inline" >
            {steps.map((item) => (
              <Step key={item.title}  />
            ))}
          </Steps>
        </div>
        {steps[currentStep].content}
      {/* </Card> */}
    </div>
  );
};

export default OnboardingPage;
