import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [form, setForm] = useState({
        name: '',
        productId: '',
        availableStocks: '',
        pricePerUnit: '',
        taxPercentage: '',
    });

    const fetchProducts = async () => {
        try {
            const BASE_URL = process.env.REACT_APP_BACKEND_URL;
            const response = await axios.get(`${BASE_URL}/products/`);
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const BASE_URL = process.env.REACT_APP_BACKEND_URL;
            await axios.delete(`${BASE_URL}/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete product');
        }
    };

    const handleOpenModalForCreate = () => {
        setIsEditMode(false);
        setForm({
            name: '',
            productId: '',
            availableStocks: '',
            pricePerUnit: '',
            taxPercentage: '',
        });
        setOpen(true);
    };

    const handleOpenModalForEdit = (product) => {
        setIsEditMode(true);
        setForm({
            name: product.name || '',
            productId: product.product_id || '',
            availableStocks: product.available_stocks || '',
            pricePerUnit: product.price_per_unit || '',
            taxPercentage: product.tax_percentage || '',
            id: product.id,
        });
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (isEditMode) {
                const BASE_URL = process.env.REACT_APP_BACKEND_URL;
                await axios.put(`${BASE_URL}/products/${form.id}`, {
                    name: form.name,
                    product_id: form.productId,
                    available_stocks: Number(form.availableStocks),
                    price_per_unit: Number(form.pricePerUnit),
                    tax_percentage: Number(form.taxPercentage),
                });
            } else {
                const BASE_URL = process.env.REACT_APP_BACKEND_URL;
                await axios.post(`${BASE_URL}/products/`, {
                    name: form.name,
                    product_id: form.productId,
                    available_stocks: Number(form.availableStocks),
                    price_per_unit: Number(form.pricePerUnit),
                    tax_percentage: Number(form.taxPercentage),
                });
            }

            handleCloseModal();
            fetchProducts();
        } catch (err) {
            console.error('Submit failed:', err);
            alert('Failed to save product');
        }
    };

    return (
        <Container>
            <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4">Product List</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenModalForCreate}>
                    Create New Product
                </Button>
            </Box>

            <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle>
                    {isEditMode ? 'Edit Product' : 'Create New Product'}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Product Name"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Product ID"
                        name="productId"
                        value={form.productId}
                        onChange={handleFormChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Available Stocks"
                        name="availableStocks"
                        type="number"
                        value={form.availableStocks}
                        onChange={handleFormChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Price per Unit"
                        name="pricePerUnit"
                        type="number"
                        value={form.pricePerUnit}
                        onChange={handleFormChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Tax Percentage"
                        name="taxPercentage"
                        type="number"
                        value={form.taxPercentage}
                        onChange={handleFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {isEditMode ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Product ID</strong></TableCell>
                                <TableCell><strong>Available Stocks</strong></TableCell>
                                <TableCell><strong>Price Per Unit</strong></TableCell>
                                <TableCell><strong>Tax Percentage</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.product_id}</TableCell>
                                        <TableCell>{product.available_stocks}</TableCell>
                                        <TableCell>{product.price_per_unit}</TableCell>
                                        <TableCell>{product.tax_percentage}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenModalForEdit(product)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(product.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default ProductsPage;
