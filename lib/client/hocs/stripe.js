import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

export default function withStripe(component) {
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
    // Make sure to call `loadStripe` outside of a component’s render to avoid
    // recreating the `Stripe` object on every render.
    const stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
    )

    return (
      <Elements stripe={stripePromise}>
        <component />
      </Elements>
    )
  } else {
    return component
  }
}
