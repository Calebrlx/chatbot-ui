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
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Select a Subscription Plan</h2>
      <div className="flex justify-center space-x-8">
        <div className="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Basic Plan</h3>
          <p className="mb-4">Ideal for individuals who are just getting started.</p>
          <button
            onClick={() => handleSubscribe('price_1O5xVoHFaRhHh6S8QWyJva48')}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </div>
        <div className="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Pro Plan</h3>
          <p className="mb-4">Perfect for professionals who need more features.</p>
          <button
            onClick={() => handleSubscribe('price_1O5xWiHFaRhHh6S80ecqo3Wq')}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </div>
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
};

export default PaymentStep;