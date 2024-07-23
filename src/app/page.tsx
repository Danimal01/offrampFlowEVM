'use client';
import styles from './page.module.css';

export default function Home() {
  const handleButtonClick = () => {
    const baseUrl = "https://offramp-sandbox.gatefi.com/";
    const params = new URLSearchParams({
      merchantId: '9e34f479-b43a-4372-8bdf-90689e16cd5b',
      cryptoCurrency: 'ETH',
      payout: 'SPEI',
      fiatCurrency: 'MXN',
      region: 'MX',
      wallet: '0xc458f721D11322E36f781a9C58055de489178BF2',
      walletLock: 'true',
      fiatCurrencyLock: 'true',
      cryptoCurrencyLock: 'true',
      fiatAmount: '100',
      cryptoAmountLock: 'true',
      confirmRedirectUrl: 'https://offramp-flow-evm.vercel.app/confirm/'
    });

    const url = `${baseUrl}?${params.toString()}`;
    window.open(url, '_blank');
  };

  return (
    <main className={styles.main}>
      <div className={styles.buttonContainer}>
        <button onClick={handleButtonClick} className={styles.sellButton}>
          Sell Crypto
        </button>
      </div>
    </main>
  );
}