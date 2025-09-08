import { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const denominations = [2000, 500, 100, 50, 10, 5, 2, 1];

const HomePage = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [productItems, setProductItems] = useState([{ product_id: '', quantity: '' }]);
  const [denominationCounts, setDenominationCounts] = useState({});

  const handleAddItem = () => {
    setProductItems([...productItems, { product_id: '', quantity: '' }]);
  };

  const handleRemoveItem = (index) => {
    const updatedProductItems = productItems.filter((_, i) => i !== index);
    setProductItems(updatedProductItems);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProductItems = [...productItems];
    updatedProductItems[index][field] = value;
    setProductItems(updatedProductItems);
  };

  const handleCancel = () => {
    setEmail('');
    setPaidAmount('');
    setProductItems([{ product_id: '', quantity: '' }]);
    setDenominationCounts({});
  };

  const handleGenerateBill = async () => {
    console.log('Bill generated with details:', { email, productItems, paidAmount, denominationCounts });
    if (!email || !paidAmount) {
      alert("Missing Fields")
      return
    }
    let denominationAmt = 0
    for (let denomination in denominationCounts) {
      if (denominationCounts[denomination] != '')
        denominationAmt += (parseInt(denomination) * parseInt(denominationCounts[denomination]))
    }
    console.log(denominationAmt)
    if (denominationAmt !== parseInt(paidAmount)) {
      alert(`Amount mismatch: Total calculated amount is ${denominationAmt}, but the paid amount is ${paidAmount}. Please check the denominations.`);
      return
    }
    let proItems = productItems.filter((pro) => pro.product_id !== '' || pro.quantity !== '')
    console.log(proItems)
    let fieldIssue = proItems.filter((pro) => pro.product_id == '' || pro.quantity == '')
    if (fieldIssue.length > 0) {
      alert("Missing Product Id or Quantity")
      return
    }
    if (proItems.length == 0) {
      alert("No Items Entered")
      return
    }
    let orderItems = proItems.map(pro => ({
      product_id: pro.product_id,
      quantity: parseInt(pro.quantity)
    }))
    try {
      const BASE_URL = process.env.REACT_APP_BACKEND_URL;
      let response = await axios.post(`${BASE_URL}/orders/`, {
        customer_email: email,
        paid_amount: paidAmount,
        order_items: orderItems
      });

      console.log(response.data)

      navigate('/summary', {
        state: response.data
      });
    }
    catch (err) {
      console.error('Submit failed:', err);
      alert('Failed to generate bill');
    }
  };

  const handleDenominationChange = (denom, value) => {
    setDenominationCounts((prevCounts) => ({
      ...prevCounts,
      [denom]: value,
    }));
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Fill in the details to generate the bill
        </Typography>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Customer Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAddItem}>
            Add New Item
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          {productItems.map((item, index) => (
            <Grid container spacing={2} alignItems="center" key={index}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Product ID"
                  variant="outlined"
                  fullWidth
                  value={item.product_id}
                  onChange={(e) => handleProductChange(index, 'product_id', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Denomination Counts
          </Typography>
          <Grid container spacing={2}>
            {denominations.map((denom) => (
              <Grid item xs={12} sm={3} key={denom}>
                <TextField
                  label={`Count of ₹${denom}`}
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={denominationCounts[denom] || ''}
                  onChange={(e) => handleDenominationChange(denom, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 4 }}>
          <TextField
            label="Customer Paid Amount"
            variant="outlined"
            fullWidth
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
          />
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleGenerateBill}>
            Generate Bill
          </Button>
        </Box>

        <Divider sx={{ mt: 4 }} />
      </Box>
    </Container>
  );
};

export default HomePage;
