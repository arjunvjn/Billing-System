import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const BASE_URL = process.env.REACT_APP_BACKEND_URL;
      const res = await axios.get(`${BASE_URL}/orders/`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customer_email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const handleViewOrder = async (order) => {
    try {
      const BASE_URL = process.env.REACT_APP_BACKEND_URL;
      let response = await axios.get(`${BASE_URL}/orders/${order.id}`);

      console.log(response.data)

      navigate('/summary', {
        state: { ...response.data, fromOrders: true }
      });
    }
    catch (err) {
      console.error('Submit failed:', err);
      alert('Failed to generate bill');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Orders
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search by Customer Email"
          variant="outlined"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          sx={{ width: '300px' }}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Customer Email</TableCell>
            <TableCell>Paid Amount</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>Net Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders.map(order => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleString('en-IN')}</TableCell>
              <TableCell>{order.customer_email}</TableCell>
              <TableCell>₹{order.paid_amount}</TableCell>
              <TableCell>₹{order.net_amount_without_tax}</TableCell>
              <TableCell>₹{order.net_tax_amount}</TableCell>
              <TableCell>₹{order.net_amount_without_tax + order.net_tax_amount}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleViewOrder(order)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default OrdersPage;
