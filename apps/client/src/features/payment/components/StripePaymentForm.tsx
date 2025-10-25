import { loadStripe } from '@stripe/stripe-js';
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';

import CheckoutForm from '@/features/payment/components/CheckoutForm';

const stripe = loadStripe(import.meta.env.VITE_STRIPE_PULISHABLE_KEY);

interface StripePaymentFormProps {
  clientSecret: Promise<string> | string;
}

export default function StripePaymentForm({
  clientSecret,
}: StripePaymentFormProps) {
  return (
    <CheckoutProvider
      options={{
        clientSecret,
      }}
      stripe={stripe}
    >
      <CheckoutForm />
    </CheckoutProvider>
  );
}
