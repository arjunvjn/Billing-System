import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Table, TableHead, TableRow,
    TableCell, TableBody, Divider, Button, Grid
} from '@mui/material';

const BillSummary = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const roundedNetPrice = Math.floor(state.net_amount_without_tax + state.net_tax_amount)
    let balance = parseInt(state.paid_amount) - roundedNetPrice;

    const balanceDenominations = [2000, 500, 100, 50, 10, 5, 2, 1].reduce((acc, denom) => {
        const count = Math.floor(balance / denom);
        if (count > 0) {
            acc[denom] = count;
            balance -= count * denom;
        }
        return acc;
    }, {});

    if (!state || !state.order_items) {
        return (
            <Container>
                <Typography variant="h5" mt={4}>No bill data available.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Back to Home</Button>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Bill Summary
            </Typography>

            <Typography variant="h6">Customer Email: {state.customer_email}</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Ordered Products</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product ID</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Purchase Price</TableCell>
                        <TableCell>Tax % for Unit</TableCell>
                        <TableCell>Tax payable for item</TableCell>
                        <TableCell>Total price for item</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.order_items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.product.product_id}</TableCell>
                            <TableCell>{item.product.price_per_unit}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{(item.amount_without_tax).toFixed(2)}</TableCell>
                            <TableCell>{item.product.tax_percentage}</TableCell>
                            <TableCell>{(item.tax_amount).toFixed(2)}</TableCell>
                            <TableCell>{(item.amount_without_tax + item.tax_amount).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Divider sx={{ my: 4 }} />

            <Typography><strong>Total Price (before tax):</strong> ₹{(state.net_amount_without_tax).toFixed(2)}</Typography>
            <Typography><strong>Total Tax:</strong> ₹{(state.net_tax_amount).toFixed(2)}</Typography>
            <Typography><strong>Net Price:</strong> ₹{(state.net_amount_without_tax + state.net_tax_amount).toFixed(2)}</Typography>
            <Typography><strong>Rounded Down Net Price:</strong> ₹{Math.floor(state.net_amount_without_tax + state.net_tax_amount)}</Typography>
            <Typography><strong>Paid Amount:</strong> ₹{state.paid_amount}</Typography>
            <Typography><strong>Balance to Return:</strong> ₹{state.paid_amount - roundedNetPrice}</Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Balance Denomination Breakdown</Typography>
            <Grid container spacing={2}>
                {Object.entries(balanceDenominations).map(([denom, count]) => (
                    <Grid item xs={12} sm={3} key={denom}>
                        ₹{denom} x {count}
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                {state.fromOrders && (
                    <Button variant="outlined" onClick={() => navigate('/orders')}>
                        Back to Orders
                    </Button>
                )}
                {!state.fromOrders && (
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default BillSummary;
