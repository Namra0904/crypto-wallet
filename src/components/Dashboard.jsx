"use client"

import { useEffect, useState } from "react"
import { Typography, Button, Modal, Table, Spin, message, Input, Form } from "antd"
import {
  SendOutlined,
  QrcodeOutlined,
  CheckOutlined,
  CopyOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LinkOutlined,
  MoreOutlined,
  Log,
  LogoutOutlined
} from "@ant-design/icons"
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { useWallet } from "./WalletProvider"
import { useNavigate } from "react-router-dom"
import { getWalletBalance, getTransactions, sendTransaction, getGraphData } from "../services/api"

const { Title, Text, Paragraph } = Typography

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tokens")
  const [balance, setBalance] = useState(0.0)
  const [allTransactions, setAllTransactions] = useState([])
  const [transactionDetails, setTransactionDetails] = useState(null)
  const [graphData, setGraphData] = useState(null)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendForm] = Form.useForm()
  const [copied, setCopied] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [hideBalance, setHideBalance] = useState(false)
  const { wallet, lockCurrentWallet } = useWallet();
  const [chartData, setChartData] = useState([]);

  // Fetch wallet data and transactions
  useEffect(() => {
    apiCalls();
  }, [])


  const apiCalls = async () => {
    try {
      const walletData = await getWalletBalance(wallet.address);
      // console.log("Wallet Data:", walletData);  // Debugging
      if (walletData && walletData.balance !== undefined) {
        setBalance(walletData.balance);
      } else {
        console.error("Failed to fetch wallet balance");
      }

      const transactionsData = await getTransactions(wallet.address);
      // console.log("Transactions Data:", transactionsData);  // Debugging
      if (transactionsData && transactionsData.transactions !== undefined) {
        setAllTransactions(transactionsData.transactions);
      } else {
        console.error("Failed to fetch transactions");
      }

      const graphData = await getGraphData(wallet.address);
      // console.log("Transactions Data:", transactionsData);  // Debugging
      if (graphData && graphData.transactions !== undefined) {
        setGraphData(graphData.transactions);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error in API calls:", error);
    }
  };

  useEffect(() => {
    if (graphData) {
      setChartData(prepareChartData());
    }
  }, [graphData]);
  // Prepare data for the chart
  const prepareChartData = () => {
    if (!graphData) return [];
    // Sort transactions by date
    const sortedTransactions = [...graphData].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))

    // console.log('s', sortedTransactions)
    // Create cumulative balance data
    let balance = 0
    return sortedTransactions.map((tx) => {
      if (tx.type === "sent") {
        balance -= tx.amount
      } else {
        balance += tx.amount
      }

      return {
        date: new Date(tx.dateTime).toLocaleDateString(),
        balance: balance,
        amount: tx.amount,
        type: tx.type,
      }
    })
  }


  // Format ETH value from Wei
  const formatEthFromWei = (wei) => {
    const weiValue = Number.parseInt(wei, 10)
    return (weiValue / 1000000000000000000).toFixed(6)
  }

  // Format timestamp to date
  const formatTimestamp = (timestamp) => {
    const date = new Date(Number.parseInt(timestamp) * 1000)
    return date.toLocaleString()
  }

  const handleTransactionClick = (hash) => {
    setLoading(true)
    setTimeout(() => {
      setTransactionDetails(
        allTransactions.filter(t => t.hash === hash)[0]
      )
      setLoading(false)
      setShowTransactionModal(true)
    }, 500)
  }

  // Handle send transaction
  const handleSendTransaction = async (values) => {
    setLoading(true)
    let res = await sendTransaction(sendForm.getFieldValue("to"), sendForm.getFieldValue("amount"), wallet.privatekey)
    console.log(res)
    message.success(`Transaction of ${values.amount} ETH sent to ${values.to}`)
    setLoading(false)
    setShowSendModal(false)
    sendForm.resetFields()
  }

  // Copy wallet address to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Action buttons
  const actionButtons = [
    {
      icon: <SendOutlined />,
      text: "Send",
      onClick: () => setShowSendModal(true),
    },
    {
      icon: <QrcodeOutlined />,
      text: "Receive",
      onClick: () => setShowQRModal(true),
    },
  ]

  // Transaction columns for the table
  const transactionColumns = [
    {
      title: "Date",
      dataIndex: "timeStamp",
      key: "timeStamp",
      render: (text) => formatTimestamp(text),
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => {
        const isSent = record.type.toLowerCase() === "sent"
        return (
          <span style={{ color: isSent ? "#ff4d4f" : "#52c41a" }}>
            {isSent ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {isSent ? "Sent" : "Received"}
          </span>
        )
      },
    },
    {
      title: "Amount (ETH)",
      dataIndex: "value",
      key: "value",
      render: (text, record) => {
        const isSent = record.from.toLowerCase() === wallet.address.toLowerCase()
        return (
          <span style={{ color: isSent ? "#ff4d4f" : "#52c41a" }}>
            {isSent ? "-" : "+"}
            {formatEthFromWei(text)}
          </span>
        )
      },
    },
    {
      title: "Transaction Hash",
      dataIndex: "hash",
      key: "hash",
      render: (text) => (
        <button
          onClick={() => handleTransactionClick(text)}
          style={{
            padding: 0,
            background: "none",
            border: "none",
            color: "#1890ff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {`${text.substring(0, 6)}...${text.substring(text.length - 4)}`}
        </button>
      ),
    },
  ]

  return (
    <div className="min-h-screen text-white p-2 sm:p-4" style={{ backgroundColor: "#121212" }}>
      <header className="flex justify-between items-center h-12 border-b border-gray-800 px-4">
        <div className="flex items-center">
          <span className="text-white font-bold text-sm text-center sm:text-lg text-center">Pied Wallet</span>
        </div>
      </header>

      <main className="flex justify-center p-0">
        <div className="w-full max-w-lg mx-auto rounded-xl overflow-hidden">
          {/* Network selector (simplified) */}
          <div className="flex justify-between items-center p-3 sm:p-4">
            <button className="bg-gray-700 border-none text-white text-xs sm:text-sm rounded-full px-3 py-1">
              🔵 Ethereum
            </button>
            <button className="text-white bg-transparent border-none" onClick={() => {
              lockCurrentWallet();
              navigate("/login");
            }}>
              <LogoutOutlined />
            </button>
          </div>

          {/* Wallet address */}
          <div className="flex flex-col items-center py-3 sm:py-4">
            <div className="flex items-center">
              <Text className="text-gray-400 text-xs sm:text-sm">
                {`${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 6)}`}
              </Text>
              <button
                className="text-gray-400 bg-transparent border-none ml-1 cursor-pointer"
                onClick={() => copyToClipboard(wallet.address)}
              >
                {copied ? <CheckOutlined /> : <CopyOutlined />}
              </button>
            </div>
          </div>

          {/* Balance */}
          <div className="flex flex-col items-center py-3 sm:py-4">
            <h3 className="text-white m-0 text-lg sm:text-2xl font-semibold">
              {hideBalance ? "••••••" : `${balance} ETH`}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm m-0">
              {hideBalance ? "••••••" : `$${(balance * 3500).toFixed(2)} USD`}
            </p>
            <button
              className="text-gray-400 bg-transparent border-none mt-1 cursor-pointer"
              onClick={() => setHideBalance(!hideBalance)}
            >
              <EyeOutlined />
            </button>
          </div>

          {/* Balance Chart */}
          <div className="px-4 py-2 bg-gray-900 rounded-lg mb-4">
            <p className="text-white text-sm font-medium mb-2">Balance History</p>
            <div style={{ width: "100%", height: 150 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: "#999" }} tickLine={{ stroke: "#666" }} />
                  <YAxis tick={{ fill: "#999" }} tickLine={{ stroke: "#666" }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    labelStyle={{ color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#1890ff" fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-around py-2 sm:py-4 bg-gray-900 rounded-3xl p-8 mb-4">
            {actionButtons.map((button, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  className="bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center mb-1 hover:bg-gray-600"
                  onClick={button.onClick}
                >
                  {button.icon}
                </button>
                <span className="text-white text-xs sm:text-sm">{button.text}</span>
              </div>
            ))}
          </div>

          {/* Custom Tabs */}
          <div className="px-2 sm:px-4">
            <div className="flex border-b border-gray-700 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "tokens" ? "text-white border-b-2 border-blue-500" : "text-gray-400"}`}
                onClick={() => setActiveTab("tokens")}
              >
                Tokens
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "nfts" ? "text-white border-b-2 border-blue-500" : "text-gray-400"}`}
                onClick={() => setActiveTab("nfts")}
              >
                NFTs
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === "activity" ? "text-white border-b-2 border-blue-500" : "text-gray-400"}`}
                onClick={() => setActiveTab("activity")}
              >
                Activity
              </button>
            </div>

            {/* Tab Content */}
            <div className="px-2 sm:px-4">
              {activeTab === "tokens" && (
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-white text-xs sm:text-sm">Ethereum</span>
                  <span className="text-white text-xs sm:text-sm">{balance} ETH</span>
                </div>
              )}

              {activeTab === "nfts" && (
                <div className="flex justify-center items-center h-32 text-gray-400 text-xs sm:text-sm">
                  No NFTs found
                </div>
              )}

              {activeTab === "activity" && (
                <div>
                  <Table
                    dataSource={allTransactions}
                    columns={transactionColumns}
                    rowKey="hash"
                    size="small"
                    pagination={{ pageSize: 5 }}
                    style={{
                      background: "transparent",
                      color: "white",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Transaction Details Modal */}
      <Modal
        title="Transaction Details"
        open={showTransactionModal}
        onCancel={() => setShowTransactionModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowTransactionModal(false)}>
            Close
          </Button>,
          <Button
            key="explorer"
            type="primary"
            icon={<LinkOutlined />}
            onClick={() => window.open(`https://sepolia.etherscan.io/tx/${transactionDetails?.hash}`, "_blank")}
          >
            View on Explorer
          </Button>,
        ]}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflow: "auto" }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
          </div>
        ) : transactionDetails ? (
          <div>
            <div style={{ marginBottom: "16px", padding: "16px", border: "1px solid #333", borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                {transactionDetails.from.toLowerCase() === wallet.address.toLowerCase() ? (
                  <ArrowUpOutlined style={{ color: "#ff4d4f", marginRight: "8px" }} />
                ) : (
                  <ArrowDownOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
                )}
                <span style={{ fontWeight: "bold" }}>
                  {transactionDetails.from.toLowerCase() === wallet.address.toLowerCase()
                    ? "Sent"
                    : "Received"}
                </span>
              </div>
              <p>
                <strong>Amount:</strong> {formatEthFromWei(Number.parseInt(transactionDetails.value, 16).toString())}{" "}
                ETH
              </p>
              <p>
                <strong>Status:</strong> <span style={{ color: "#52c41a" }}>Success</span>
              </p>
            </div>

            <div style={{ padding: "16px", border: "1px solid #333", borderRadius: "8px" }}>
              <h3 style={{ marginTop: 0 }}>Transaction Details</h3>
              <p>
                <strong>Hash:</strong> {transactionDetails.hash}
              </p>
              <p>
                <strong>Block:</strong> {Number.parseInt(transactionDetails.blockNumber, 16)}
              </p>
              <p>
                <strong>From:</strong> {transactionDetails.from}
              </p>
              <p>
                <strong>To:</strong> {transactionDetails.to}
              </p>
              <p>
                <strong>Gas Limit:</strong> {Number.parseInt(transactionDetails.gas, 16)}
              </p>
              <p>
                <strong>Gas Price:</strong> {Number.parseInt(transactionDetails.gasPrice, 16)} Wei
              </p>
              <p>
                <strong>Nonce:</strong> {Number.parseInt(transactionDetails.nonce, 16)}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Send Transaction Modal */}
      <Modal title="Send ETH" open={showSendModal} onCancel={() => setShowSendModal(false)} footer={null}>
        <Form form={sendForm} layout="vertical" onFinish={handleSendTransaction}>
          <Form.Item
            name="to"
            label="Recipient Address"
            rules={[{ required: true, message: "Please input recipient address!" }]}
          >
            <Input placeholder="0x..." />
          </Form.Item>
          <Form.Item name="amount" label="Amount (ETH)" rules={[{ required: true, message: "Please input amount!" }]}>
            <Input type="number" placeholder="0.0" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send Transaction
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title="Receive ETH"
        open={showQRModal}
        onCancel={() => setShowQRModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowQRModal(false)}>
            Close
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div
            style={{
              width: "200px",
              height: "200px",
              margin: "0 auto",
              background: `url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${wallet.address}')`,
              backgroundSize: "cover",
            }}
          />
          <p style={{ marginTop: "16px", wordBreak: "break-all" }}>
            {wallet.address}
            <button
              onClick={() => copyToClipboard(wallet.address)}
              style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "8px" }}
            >
              {copied ? <CheckOutlined style={{ color: "#52c41a" }} /> : <CopyOutlined style={{ color: "#1890ff" }} />}
            </button>
          </p>
          <p style={{ color: "#999" }}>Scan this QR code or copy the address to receive ETH</p>
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard

