import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isOrders = location.pathname === '/orders';
  const isProducts = location.pathname === '/products';

  const goToHome = () => navigate('/');
  const goToOrders = () => navigate('/orders');
  const goToProducts = () => navigate('/products');

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Store
        </Typography>

        {!isHome && (
          <Button color="inherit" onClick={goToHome}>
            Home Page
          </Button>
        )}

        {!isProducts && (
          <Button color="inherit" onClick={goToProducts}>
            View Products
          </Button>
        )}

        {!isOrders && (
          <Button color="inherit" onClick={goToOrders}>
            View Orders
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
