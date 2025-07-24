import React from "react";
import { ethers } from "ethers";

export const ShowCheckout = ({
  state,
  walletAddress,
  setWalletAddress,
  txStatus,
  setTxStatus,
  isLoading,
  setIsLoading,
  connectWallet,
  disconnectWallet,
}) => {
  const subtotal = state.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = 30.0;
  const totalItems = state.reduce((acc, item) => acc + item.qty, 0);

  const handleMetaMaskPayment = async () => {
    if (!walletAddress || !window.ethereum) return alert("Please connect MetaMask.");
    try {
      setIsLoading(true);
      setTxStatus("🦊 Awaiting confirmation in MetaMask...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: walletAddress,
        value: ethers.utils.parseEther("0.001"),
      });
      setTxStatus("⛏️ Transaction pending...");
      await tx.wait();
      setTxStatus("🎉 Transaction confirmed!");
    } catch (err) {
      console.error(err);
      setTxStatus("❌ Transaction failed or rejected");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row my-4">
        {/* Order Summary and MetaMask */}
        <div className="col-md-5 col-lg-4 order-md-last">
          <div className="card mb-4">
            <div className="card-header py-3 bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  Products ({totalItems}) <span>${Math.round(subtotal)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Shipping <span>${shipping}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>${Math.round(subtotal + shipping)}</strong>
                </li>
              </ul>

              {/* MetaMask Section */}
              <div className="mt-4">
                <h6>💳 Pay with MetaMask</h6>
                {walletAddress ? (
                  <>
                    <button className="btn btn-success w-100 mb-2" disabled>
                      Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </button>
                    <button
                      onClick={disconnectWallet}
                      className="btn btn-outline-danger w-100 mb-2"
                    >
                      Disconnect Wallet
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="btn btn-outline-primary w-100 mb-2"
                  >
                    Connect MetaMask
                  </button>
                )}
                <button
                  className="btn btn-primary w-100"
                  onClick={handleMetaMaskPayment}
                  disabled={!walletAddress || isLoading}
                >
                  {isLoading ? "Processing..." : "Pay with MetaMask"}
                </button>
                {txStatus && (
                  <div className="alert alert-info mt-3 text-center">{txStatus}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Billing and Card Form */}
        <div className="col-md-7 col-lg-8">
          <div className="card mb-4">
            <div className="card-header py-3">
              <h4 className="mb-0">Billing address</h4>
            </div>
            <div className="card-body">
              <form className="needs-validation" noValidate>
                {/* Form Fields... (keep same) */}
                {/* ... */}
                <hr className="my-4" />
                <h4 className="mb-3">Credit Card Payment</h4>
                {/* Credit Card Fields... */}
                <button className="w-100 btn btn-primary" type="submit" disabled>
                  Continue to checkout (Card Payment)
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
