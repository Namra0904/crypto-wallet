import { useState } from "react";
import { Card, Checkbox, Button, Typography, Divider } from "antd";
import { RocketOutlined, ImportOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const OnboardingPage = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/security");
  };
  const handleCreateNewWallet = () => {
    navigate("/create");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden bg-gray-800 border-gray-700"> */}
      <div className="text-center mb-6">
        <Title level={3} className="mb-2 text-white">
          Let's get started
        </Title>
        <Text className="text-lg text-gray-300">
          Trusted by millions, this is a secure wallet making the world of web3
          accessible to all.
        </Text>
      </div>

      <div className="mb-6">
        <Checkbox
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-full text-gray-300"
        >
          I agree to the Terms of use
        </Checkbox>
      </div>

      <div className="space-y-4">
        <Button
          type="primary"
          block
          size="large"
          icon={<RocketOutlined />}
          disabled={!agreed}
          className="h-12 font-semibold"
          onClick={handleCreateNewWallet}
        >
          Create a new wallet
        </Button>

        <Button
          block
          size="large"
          icon={<ImportOutlined />}
          disabled={!agreed}
          className="h-12 font-semibold bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:border-gray-500"
          onClick={handleRedirect}
        >
          Import an existing wallet
        </Button>
      </div>

      {/* <Divider className="my-6 border-gray-700" /> */}

      <div className="text-center">
        <Text className="text-gray-400">
          Already have a wallet?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Connect here
          </Link>
        </Text>
      </div>
      {/* </Card> */}
    </div>
  );
};

export default OnboardingPage;
