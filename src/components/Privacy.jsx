import { Card, Button, Typography, Divider, Checkbox } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const PrivacyConsentPage = () => {

  const navigate = useNavigate();


    const handleRedirect = () => {
      navigate("/recover");

    }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* <Card className="w-full max-w-lg shadow-md rounded-xl p-6"> */}
        <div className="text-center mb-6">
          <Title level={3} className="mb-2">
            Help us improve
          </Title>
          <Text type="secondary" className="text-base">
            We'd like to gather basic usage and diagnostics data to improve our
            service. Know that we never sell the data you provide here.
          </Text>
        </div>

        <div className="mb-6 text-center">
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            className="text-blue-500 hover:text-blue-700"
          >
            Learn how we protect your privacy while collecting usage data
          </Button>
        </div>

        <div className="mb-8">
          <Title level={5} className="mb-4">
            When we gather metrics, it will always be...
          </Title>

          <div className="space-y-4 text-white">
            {["Private", "Anonymous", "Optional"].map((label, index) => (
              <div className="flex items-start" key={index}>
                <div className=" rounded-4xl p-2 mr-3 mt-1">
                  <InfoCircleOutlined className="" />
                </div>
                <div>
                  <Text strong>{label}:</Text>
                  {label === "Private" &&
                    " Clicks and views on the app are stored, but personal details (like your public address) are not."}
                  {label === "Anonymous" &&
                    " We temporarily use your IP address to detect a general location, but it's never stored."}
                  {label === "Optional" &&
                    " You decide if you want to share or delete your usage data via settings any time."}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <Divider /> */}

        <div className="mb-6">
          <Paragraph className="text-gray-700">
            We'll use this data to learn how you interact with our marketing
            communications. We may share relevant news like product updates.
          </Paragraph>
          <Paragraph className="text-gray-700">
            We'll let you know if we decide to use this data for other purposes.
            You can review our Privacy Policy for more information. You can go
            to settings and opt out at any time.
          </Paragraph>
        </div>

        <div className="flex items-center mb-4">
          <Checkbox className="mr-2" />
          <Text className="ms-2">
             I agree to share anonymous usage data to help improve the product
          </Text>
        </div>

        <div className="flex justify-between gap-4">
          <Button
            size="large"
            className="w-40 h-12 font-medium"
            onClick={handleRedirect}
          >
            No thanks
          </Button>
          <Button
            type="primary"
            size="large"
            className="w-40 h-12 font-medium"
            onClick={handleRedirect}
          >
            Agree
          </Button>
        </div>
      {/* </Card> */}
    </div>
  );
};

export default PrivacyConsentPage;
