/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { CreditCard, Bitcoin, PlusCircle } from "lucide-react";
import { useUser } from "../../../../context/useUser";
import { addFundsToWallet } from "../../../../lib/helpers/user";
import { useAppToast } from "../../../../lib/useAppToast";
import opay from '../../../../assets/opay.jpeg'
import moniepoint from '../../../../assets/moniepoint.png'
import flutterwave from '../../../../assets/flutterwave.jpeg'

const Wallet = () => {
  // State for wallet balance and transactions
  const { user, setRefetch, refetch } = useUser();
  const toast = useAppToast();
  const [balance, setBalance] = useState(user?.wallet || 0); // Example starting balance
  const [transactions, setTransactions] = useState(user?.transactions || []);

  // State for add funds modal
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Keep form and preview in sync with user context
  useEffect(() => {
    setBalance(user ? user.wallet : 0);
    setTransactions(user?.transactions || []);
  }, [user, refetch]);

  // Handle add funds
  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      const result = await addFundsToWallet(
        amt,
        method as "card" | "blockchain"
      );
      toast({
        description: result.message,
        status: "success",
      });
      setSuccess(result.message);
      setAmount("");
      setShowModal(false);
      setRefetch(!refetch);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast({
        description: err.message || "Something went wrong",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // const dollarToNairaRate = 1500; // Example conversion
  // const dollarAmount = 10; // Simulated crypto amount

  const dollarToNairaRate = 1530; // Example exchange rate
  const btcRate = 68000000; // 1 BTC ≈ ₦68,000,000
  const usdtRate = 1500; // 1 USDT ≈ ₦1,500

  const nairaAmount = parseFloat(amount || "0");
  const dollarAmount = nairaAmount / dollarToNairaRate;

  const btcAmount = nairaAmount / btcRate;
  const usdtAmount = nairaAmount / usdtRate;

  useEffect(() => {
    if (method === "blockchain") {
      setAmount((dollarAmount * dollarToNairaRate).toString());
    }
  }, [dollarAmount, method]);

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">
        Wallet
      </h1>
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <div className="text-gray-600 text-sm">Available Balance</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">
            ₦{balance.toLocaleString()}
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg mt-4 md:mt-0"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle className="w-5 h-5" /> Add Funds
        </button>
      </div>
      {/* Add Funds Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Add Funds</h2>

            <form onSubmit={handleAddFunds} className="space-y-4">
              {/* Amount Input */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      id: "card",
                      label: "Card",
                      icon: <CreditCard className="w-5 h-5" />,
                    },
                    {
                      id: "blockchain",
                      label: "Blockchain",
                      icon: <Bitcoin className="w-5 h-5" />,
                    },
                    {
                      id: "opay",
                      label: "Opay",
                      icon: <img src={opay} className="w-5 h-5" alt="opay" />,
                    },
                    {
                      id: "moniepoint",
                      label: "Moniepoint",
                      icon: (
                        <img
                          src={moniepoint}
                          className="w-5 h-5"
                          alt="moniepoint"
                        />
                      ),
                    },
                    {
                      id: "flutterwave",
                      label: "Flutterwave",
                      icon: (
                        <img
                          src={flutterwave}
                          className="w-5 h-5"
                          alt="flutterwave"
                        />
                      ),
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                        method === opt.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={opt.id}
                        checked={method === opt.id}
                        onChange={() => setMethod(opt.id)}
                        className="accent-blue-600"
                      />
                      {opt.icon} {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Blockchain Simulated Payment Display */}
              {/* {method === "blockchain" && (
                <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 space-y-2">
                  <p>
                    You're paying <strong>${dollarAmount}</strong> (~₦
                    {dollarAmount * dollarToNairaRate}) via crypto.
                  </p>
                  <p>
                    Crypto amount: <strong>0.00022 BTC</strong> or{" "}
                    <strong>10 USDT</strong>
                  </p>
                  <p className="text-green-600 font-medium">
                    Exchange Rate: $1 ≈ ₦{dollarToNairaRate}
                  </p>
                </div>
              )} */}
              {method === "blockchain" && (
                <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 space-y-2">
                  <p>
                    You're paying <strong>${dollarAmount.toFixed(2)}</strong>{" "}
                    (~₦{nairaAmount.toLocaleString()}) via crypto.
                  </p>
                  <p>
                    Crypto amount: <strong>{btcAmount.toFixed(6)} BTC</strong>{" "}
                    or <strong>{usdtAmount.toFixed(2)} USDT</strong>
                  </p>
                  <p className="text-green-600 font-medium">
                    Exchange Rate: $1 ≈ ₦{dollarToNairaRate}
                  </p>
                </div>
              )}

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg"
                disabled={loading}
              >
                {loading ? "Processing..." : `Add ₦${amount || ""}`}
              </button>

              {success && (
                <div className="text-green-600 text-sm mt-2">{success}</div>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Transaction History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-700">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b last:border-none">
                    <td className="py-3 px-4">{tx.date}</td>
                    <td className="py-3 px-4">{tx.type}</td>
                    <td className="py-3 px-4">{tx.method}</td>
                    <td className="py-3 px-4 text-right">
                      ₦{tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
