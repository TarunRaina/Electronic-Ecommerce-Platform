import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

function Checkout({ cartItems }) {
  const navigate = useNavigate();
  const [orderCreated, setOrderCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async formData => {
    setLoading(true);

    try {
      const token = localStorage.getItem('MERNEcommerceToken') || localStorage.getItem('token'); // depends on your login storage

      const response = await axios.post(
        'https://electronic-ecommerce-platform.onrender.com/api/checkout/create-order',
        {
          userId: 'guest', // Replace with decoded user ID if available
          items: cartItems || [],
          totalAmount: (cartItems || []).reduce((acc, item) => acc + item.price, 0),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      if (response.status === 201) {
        setLoading(false);
        setOrderCreated(true);
        navigate('/order-success');
      } else {
        setLoading(false);
        setErrorMessage(response.data.error || 'Something went wrong during checkout.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setLoading(false);
      setErrorMessage(error.response?.data?.error || 'An error occurred while processing your order.');
    }
  };

  return (
    <div className="checkout-container">
      {orderCreated ? (
        <Typography variant="h4" gutterBottom>
          Thank you for your order! You will be redirected shortly.
        </Typography>
      ) : (
        <>
          {loading && <CircularProgress />}
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          <CheckoutForm onSubmit={handleSubmit} />
        </>
      )}
    </div>
  );
}

export default Checkout;
