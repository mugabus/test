// src/hooks/useMetaMask.js
import { useState } from "react";
import { ethers } from "ethers";

const useMetaMask = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [txStatus, setTxStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed!");
      return;
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

  return {
    walletAddress,
    txStatus,
    isLoading,
    connectWallet,
    disconnectWallet,
    handleMetaMaskPayment,
  };
};

export default useMetaMask;
