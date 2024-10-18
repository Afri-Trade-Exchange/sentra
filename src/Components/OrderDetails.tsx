import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface OrderDetails {
  orderNumber: string;
  status: string;
  shippingAddress: string;
  estimatedDelivery: string;
}

export default function OrderDetails() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the order details from an API
    // For this example, we'll simulate an API call with setTimeout
    setTimeout(() => {
      setOrderDetails({
        orderNumber: orderNumber || '',
        status: 'In Transit',
        shippingAddress: '123 Main St, City, Country',
        estimatedDelivery: '2023-05-15',
      });
    }, 1000);
  }, [orderNumber]);

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
        <p><strong>Status:</strong> {orderDetails.status}</p>
        <p><strong>Shipping Address:</strong> {orderDetails.shippingAddress}</p>
        <p><strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery}</p>
      </div>
    </div>
  );
}
