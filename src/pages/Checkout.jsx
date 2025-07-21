import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);

  const [walletAddress, setWalletAddress] = useState(null);
  const [txStatus, setTxStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      return alert("MetaMask not installed!");
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      setTxStatus("✅ Wallet connected");
    } catch (err) {
      console.error(err);
      setTxStatus("❌ Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setTxStatus("👋 Wallet disconnected");
  };

  const handleMetaMaskPayment = async () => {
    if (!walletAddress || !window.ethereum) {
      alert("Please connect MetaMask.");
      return;
    }

    try {
      setIsLoading(true);
      setTxStatus("🦊 Awaiting confirmation in MetaMask...");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Simulated transaction
      const tx = await signer.sendTransaction({
        to: walletAddress, // send to self just for testing
        value: ethers.utils.parseEther("0.001"), // simulate price
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

  const EmptyCart = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">No item in Cart</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i>Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowCheckout = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    state.forEach((item) => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;
    });

    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})<span>${Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>${shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>

                  {/* MetaMask Section */}
                  <div className="mt-4">
                    <h6 className="mb-2">💳 Pay with MetaMask</h6>
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
                      <div className="alert alert-info mt-3 text-center">
                        {txStatus}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address and Credit Card Form */}
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" noValidate>
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label htmlFor="firstName" className="form-label">
                          First name
                        </label>
                        <input type="text" className="form-control" id="firstName" required />
                        <div className="invalid-feedback">Valid first name is required.</div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label htmlFor="lastName" className="form-label">
                          Last name
                        </label>
                        <input type="text" className="form-control" id="lastName" required />
                        <div className="invalid-feedback">Valid last name is required.</div>
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="you@example.com" required />
                        <div className="invalid-feedback">Please enter a valid email address for shipping updates.</div>
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" className="form-control" id="address" placeholder="1234 Main St" required />
                        <div className="invalid-feedback">Please enter your shipping address.</div>
                      </div>

                      <div className="col-12">
                        <label htmlFor="address2" className="form-label">
                          Address 2 <span className="text-muted">(Optional)</span>
                        </label>
                        <input type="text" className="form-control" id="address2" placeholder="Apartment or suite" />
                      </div>

                      <div className="col-md-5 my-1">
                        <label htmlFor="country" className="form-label">Country</label>
                        <select className="form-select" id="country" required>
                          <option value="">Choose...</option>
                          <option>India</option>
                        </select>
                        <div className="invalid-feedback">Please select a valid country.</div>
                      </div>

                      <div className="col-md-4 my-1">
                        <label htmlFor="state" className="form-label">State</label>
                        <select className="form-select" id="state" required>
                          <option value="">Choose...</option>
                          <option>Punjab</option>
                        </select>
                        <div className="invalid-feedback">Please provide a valid state.</div>
                      </div>

                      <div className="col-md-3 my-1">
                        <label htmlFor="zip" className="form-label">Zip</label>
                        <input type="text" className="form-control" id="zip" required />
                        <div className="invalid-feedback">Zip code required.</div>
                      </div>
                    </div>

                    <hr className="my-4" />
                    <h4 className="mb-3">Credit Card Payment</h4>

                    <div className="row gy-3">
                      <div className="col-md-6">
                        <label htmlFor="cc-name" className="form-label">Name on card</label>
                        <input type="text" className="form-control" id="cc-name" required />
                        <small className="text-muted">Full name as displayed on card</small>
                        <div className="invalid-feedback">Name on card is required</div>
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="cc-number" className="form-label">Credit card number</label>
                        <input type="text" className="form-control" id="cc-number" required />
                        <div className="invalid-feedback">Credit card number is required</div>
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="cc-expiration" className="form-label">Expiration</label>
                        <input type="text" className="form-control" id="cc-expiration" required />
                        <div className="invalid-feedback">Expiration date required</div>
                      </div>

                      <div className="col-md-3">
                        <label htmlFor="cc-cvv" className="form-label">CVV</label>
                        <input type="text" className="form-control" id="cc-cvv" required />
                        <div className="invalid-feedback">Security code required</div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <button className="w-100 btn btn-primary" type="submit" disabled>
                      Continue to checkout (Card Payment)
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
