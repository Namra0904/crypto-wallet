import { useState } from "react";
import { Checkbox, Button, Typography, Divider } from "antd";
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-md p-8 shadow-2xl rounded-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <RocketOutlined className="text-3xl text-white" />
            </div>
            <Title level={3} className="mb-2 text-white font-bold text-2xl">
              Let's get started
            </Title>
            <Text className="text-gray-300 text-base">
              Trusted by millions, this is a secure wallet making the world of
              web3 accessible to all.
            </Text>
          </div>
        </div>

        <div className="mb-6">
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-full"
          >
            <Text className="text-gray-300">
              I agree to the{" "}
              <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">
                Terms of use
              </span>
            </Text>
          </Checkbox>
        </div>

        <div className="space-y-4 mb-6">
          <Button
            type="primary"
            block
            size="large"
            icon={<RocketOutlined />}
            disabled={!agreed}
            className={`h-12 font-semibold rounded-lg transition-all duration-300 ${!agreed
                ? "opacity-50"
                : "hover:shadow-lg hover:shadow-indigo-500/30"
              }`}
            onClick={handleCreateNewWallet}
          >
            Create a new wallet
          </Button>

          <Button
            block
            size="large"
            icon={<ImportOutlined />}
            disabled={!agreed}
            className={`h-12 font-semibold rounded-lg border border-indigo-400 text-indigo-400  hover:bg-indigo-900/30 hover:border-indigo-300 hover:text-indigo-300 transition-all duration-300 ${!agreed ? "opacity-50" : ""
              }`}
            onClick={handleRedirect}
          >
            Import an existing wallet
          </Button>
        </div>

        <Divider className="border-gray-600 my-6" />

        <div className="text-center">
          <Text className="text-gray-400">
            Already have a wallet?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
            >
              Connect here
            </Link>
          </Text>
        </div>
      </div>


    </div>
  );
};

export default OnboardingPage;