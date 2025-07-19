// frontend/src/hooks/useCurrencyRate.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const FALLBACK_RATE = 83.3;

const useCurrencyRate = () => {
  const [rate, setRate] = useState(() => {
    const cached = localStorage.getItem('usd_to_inr_rate');
    return cached ? parseFloat(cached) : FALLBACK_RATE;
  });

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=INR');
        const liveRate = res.data.rates.INR;
        if (liveRate) {
          setRate(liveRate);
          localStorage.setItem('usd_to_inr_rate', liveRate);
        }
      } catch (e) {
        console.warn("Using fallback exchange rate:", FALLBACK_RATE);
      }
    };

    fetchRate();
  }, []);

  return rate;
};

export default useCurrencyRate;
