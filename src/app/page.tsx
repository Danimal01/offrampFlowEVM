'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [payout, setPayout] = useState('SPEI');
  const [fiatCurrency, setFiatCurrency] = useState('MXN');
  const [region, setRegion] = useState('MX');
  const [wallet, setWallet] = useState('0xc458f721D11322E36f781a9C58055de489178BF2'); // Prepopulated wallet address
  const [fiatAmount, setFiatAmount] = useState('');

  const handleButtonClick = () => {
    const url = `https://offramp-sandbox.gatefi.com/?merchantId=9e34f479-b43a-4372-8bdf-90689e16cd5b&cryptoCurrency=ETH&payout=${payout}&fiatCurrency=${fiatCurrency}&region=${region}&wallet=${wallet}&walletLock=true&fiatCurrencyLock=true&cryptoCurrencyLock=true&fiatAmount=${fiatAmount}&cryptoAmountLock=true&confirmRedirectUrl=https://offramp-flow-evm.vercel.app/confirm/`;
    window.open(url, '_blank');
  };

  return (
    <main className={styles.main}>
      <form className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="payout">Payout Method:</label>
          <select id="payout" value={payout} onChange={(e) => setPayout(e.target.value)}>
            <option value="SPEI">SPEI</option>
            <option value="TRANSFIYA">TRANSFIYA</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="fiatCurrency">Fiat Currency:</label>
          <select id="fiatCurrency" value={fiatCurrency} onChange={(e) => setFiatCurrency(e.target.value)}>
            <option value="MXN">MXN</option>
            <option value="COP">COP</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="region">Region:</label>
          <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="MX">MX</option>
            <option value="CO">CO</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="wallet">Wallet Address:</label>
          <input
            type="text"
            id="wallet"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Enter your wallet address"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="fiatAmount">Fiat Amount:</label>
          <input
            type="number"
            id="fiatAmount"
            value={fiatAmount}
            onChange={(e) => setFiatAmount(e.target.value)}
            placeholder="Enter fiat amount"
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type="button" onClick={handleButtonClick} className={styles.sellButton}>
            Sell Crypto
          </button>
        </div>
      </form>
    </main>
  );
}
