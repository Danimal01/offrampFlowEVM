'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import styles from './confirm.module.css';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

const SEPOLIA_RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/rrXpkTzZ5ZPfyi8uJNa9FRyexjSWSWLy';
const SEPOLIA_CHAIN_ID = 11155111;

const ConfirmComponent = () => {
  const searchParams = useSearchParams();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [network, setNetwork] = useState<ethers.providers.Network | null>(null);

  useEffect(() => {
    const initializeEthereum = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);

          const network = await web3Provider.getNetwork();
          setNetwork(network);

          if (network.chainId !== SEPOLIA_CHAIN_ID) {
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexValue(SEPOLIA_CHAIN_ID) }],
              });
            } catch (switchError: any) {
              // This error code indicates that the chain has not been added to MetaMask
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: ethers.utils.hexValue(SEPOLIA_CHAIN_ID),
                        chainName: 'Sepolia Test Network',
                        nativeCurrency: {
                          name: 'Sepolia Ether',
                          symbol: 'SEP',
                          decimals: 18
                        },
                        rpcUrls: [SEPOLIA_RPC_URL],
                        blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                      },
                    ],
                  });
                } catch (addError) {
                  console.error('Failed to add Sepolia network', addError);
                }
              } else {
                console.error('Failed to switch to Sepolia network', switchError);
              }
            }
          }

          setSigner(web3Provider.getSigner());
        } catch (err: any) {
          console.error('Ethereum connection failed', err);
        }
      } else {
        window.open('https://metamask.io/', '_blank');
      }
    };

    initializeEthereum();
  }, []);

  const handleTransaction = async () => {
    if (!signer) {
      console.error('Ethereum provider not found or not connected');
      alert('Ethereum provider not found or not connected');
      return;
    }

    if (network?.chainId !== SEPOLIA_CHAIN_ID) {
      alert('Please switch to the Sepolia Test Network in your wallet');
      return;
    }

    const depositAddress = searchParams.get('depositAddress') || '';
    const cryptoAmount = parseFloat(searchParams.get('cryptoAmount') || '0');
    
    if (!ethers.utils.isAddress(depositAddress)) {
      console.error('Invalid deposit address');
      alert('Invalid deposit address');
      return;
    }

    try {
      const transactionResponse = await signer.sendTransaction({
        to: depositAddress,
        value: ethers.utils.parseEther(cryptoAmount.toString())
      });

      console.log('Transaction Hash:', transactionResponse.hash);

      const receipt = await transactionResponse.wait();

      if (receipt && receipt.status === 1) {
        alert('Transaction successful!');
      } else {
        alert('Transaction failed!');
      }
    } catch (error: any) {
      console.error('Transaction failed', error.message);
      alert(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Custom Deposit Page (Sepolia Testnet)</h1>
      <div className={styles.details}>
        <p className={styles.detailItem}><strong>Merchant ID:</strong> {searchParams.get('merchantId')}</p>
        <p className={styles.detailItem}><strong>External ID:</strong> {searchParams.get('externalId')}</p>
        <p className={styles.detailItem}><strong>Deposit Address:</strong> {searchParams.get('depositAddress')}</p>
        <p className={styles.detailItem}><strong>Region:</strong> {searchParams.get('region')}</p>
        <p className={styles.detailItem}><strong>Fiat Amount:</strong> {searchParams.get('fiatAmount')}</p>
        <p className={styles.detailItem}><strong>Fiat Currency:</strong> {searchParams.get('fiatCurrency')}</p>
        <p className={styles.detailItem}><strong>Crypto Amount:</strong> {searchParams.get('cryptoAmount')}</p>
        <p className={styles.detailItem}><strong>Crypto Currency:</strong> {searchParams.get('cryptoCurrency')}</p>
        <p className={styles.detailItem}><strong>Processing Fee:</strong> {searchParams.get('processingFee')}</p>
        <p className={styles.detailItem}><strong>Processing Fee Currency:</strong> {searchParams.get('processingFeeCurrency')}</p>
      </div>
      <button className={styles.confirmButton} onClick={handleTransaction}>Confirm Transaction</button>
    </main>
  );
};

const Confirm = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ConfirmComponent />
  </Suspense>
);

export default Confirm;