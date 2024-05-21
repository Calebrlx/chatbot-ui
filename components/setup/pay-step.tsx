// components/setup/PaymentStep.tsx
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const PaymentStep: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);
    const stripe = await stripePromise;

    if (!stripe) {
      console.error('Stripe failed to load');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const { sessionId } = await response.json();

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error(error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Select a Subscription Plan</h2>
      <button onClick={() => handleSubscribe('price_1Hh1YgLz0cGf1J2e9xqVTr2w')} disabled={loading}>
        Subscribe to Basic Plan
      </button>
      <button onClick={() => handleSubscribe('price_1Hh1YgLz0cGf1J2e9xqVTr3x')} disabled={loading}>
        Subscribe to Pro Plan
      </button>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default PaymentStep;