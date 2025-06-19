import { Dialog, DialogContent, DialogTitle, Button, Box, Typography, Divider, Chip, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromCart, selectCartItems } from '../../features/addToCart/addToSlice';
import { useState } from 'react';
import { CartItem, isMaidCartItem, isMealCartItem, isNannyCartItem } from '../../types/cartSlice';

interface CartDialogProps {
  open: boolean;
  handleClose: () => void;
  handleCheckout: () => void;
}

export const CartDialog: React.FC<CartDialogProps> = ({ 
  open, 
  handleClose, 
  handleCheckout,
}) => {
  const dispatch = useDispatch();
  
  // Get all cart items from the unified slice
  const allCartItems = useSelector(selectCartItems);
  
  // Filter items by type
  const mealCartItems = allCartItems.filter(isMealCartItem);
  const maidCartItems = allCartItems.filter(isMaidCartItem);
  const nannyCartItems = allCartItems.filter(isNannyCartItem);
  
  // Calculate totals
  const mealCartTotal = mealCartItems.reduce((sum, item) => sum + item.price, 0);
  const maidCartTotal = maidCartItems.reduce((sum, item) => sum + item.price, 0);
  const nannyCartTotal = nannyCartItems.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = mealCartTotal + maidCartTotal + nannyCartTotal;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + tax;

  const handleRemoveItem = (id: string, itemType: CartItem['type']) => {
    dispatch(removeFromCart({ id, type: itemType }));
  };

  const getDetailLabel = (item: CartItem) => {
    if (isMaidCartItem(item) && item.details?.persons) {
      return `${item.details.persons} person${item.details.persons > 1 ? 's' : ''}`;
    }
    if (isMaidCartItem(item) && item.details?.houseSize) {
      return item.details.houseSize;
    }
    if (isMaidCartItem(item) && item.details?.bathrooms) {
      return `${item.details.bathrooms} bathroom${item.details.bathrooms > 1 ? 's' : ''}`;
    }
    if (isMealCartItem(item) && item.persons) {
      return `${item.persons} person${item.persons > 1 ? 's' : ''}`;
    }
    if (isNannyCartItem(item) && item.age) {
      return `Age ≤${item.age}`;
    }
    return '';
  };

  const getItemType = (item: CartItem) => {
    if (isNannyCartItem(item)) {
      return 'Nanny Service';
    }
    if (isMaidCartItem(item)) {
      return item.serviceType === 'package' ? 'Package' : 'Add-on';
    }
    return 'Meal Package';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{
      sx: {
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e0e0e0'
      }
    }}>
      <DialogTitle sx={{ 
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e9ecef',
        fontWeight: '600',
        fontSize: '1.25rem',
        py: 2,
        px: 3,
        color: '#2d3748'
      }}>
        Your Order Summary
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, backgroundColor: '#f8f9fa' }}>
        {allCartItems.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: 6,
            backgroundColor: '#ffffff'
          }}>
            <Typography variant="body1" sx={{ color: '#4a5568', mb: 2 }}>
              Your cart is empty
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleClose}
              sx={{
                backgroundColor: '#4299e1',
                borderRadius: '6px',
                textTransform: 'none',
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                '&:hover': {
                  backgroundColor: '#3182ce'
                }
              }}
            >
              Browse Services
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ p: 3, backgroundColor: '#ffffff' }}>
              {/* Meal Cart Items */}
              {mealCartItems.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2d3748' }}>
                    Meal Services
                  </Typography>
                  {mealCartItems.map((item, index) => (
                    <CartItemCard 
                      key={`meal_${item.id || index}`}
                      item={item}
                      onRemove={() => handleRemoveItem(item.id, 'meal')}
                      itemType="meal"
                    />
                  ))}
                  <Divider sx={{ my: 3 }} />
                </>
              )}
              
              {/* Maid Cart Items */}
              {maidCartItems.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2d3748' }}>
                    Maid Services
                  </Typography>
                  {maidCartItems.map((item, index) => (
                    <CartItemCard 
                      key={`maid_${item.id || index}`}
                      item={item}
                      onRemove={() => handleRemoveItem(item.id, 'maid')}
                      itemType="maid"
                    />
                  ))}
                  <Divider sx={{ my: 3 }} />
                </>
              )}
              
              {/* Nanny Cart Items */}
              {nannyCartItems.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: '#2d3748' }}>
                    Nanny Services
                  </Typography>
                  {nannyCartItems.map((item, index) => (
                    <CartItemCard 
                      key={`nanny_${item.id || index}`}
                      item={item}
                      onRemove={() => handleRemoveItem(item.id, 'nanny')}
                      itemType="nanny"
                    />
                  ))}
                </>
              )}
            </Box>

            {/* Pricing Summary */}
            <Box sx={{ 
              backgroundColor: '#ffffff',
              borderTop: '1px solid #edf2f7',
              borderBottom: '1px solid #edf2f7',
              p: 3,
              boxShadow: '0 -1px 3px rgba(0,0,0,0.04)'
            }}>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>Subtotal:</Typography>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>₹{totalPrice.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>Tax (5%):</Typography>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>₹{tax.toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ 
                my: 2,
                borderColor: '#e2e8f0',
                borderBottomWidth: '1px'
              }} />
              
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#2d3748' }}>Total:</Typography>
                <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#2b6cb0' }}>₹{grandTotal.toFixed(2)}</Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #edf2f7',
        borderRadius: '0 0 12px 12px'
      }}>
        <Typography variant="body2" sx={{ 
          color: '#4a5568', 
          fontWeight: '500',
          fontSize: '0.875rem'
        }}>
          {allCartItems.length} item{allCartItems.length !== 1 ? 's' : ''} selected
        </Typography>
        
        <Box display="flex" gap={2}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              color: '#2b6cb0',
              borderColor: '#bee3f8',
              backgroundColor: '#ebf8ff',
              borderRadius: '6px',
              textTransform: 'none',
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: '500',
              '&:hover': {
                backgroundColor: '#bee3f8',
                borderColor: '#90cdf4'
              }
            }}
            variant="outlined"
          >
            Continue Booking
          </Button>
          
          <Button
            variant="contained"
            onClick={handleCheckout}
            disabled={allCartItems.length === 0}
            sx={{ 
              fontWeight: '500',
              borderRadius: '6px',
              textTransform: 'none',
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              backgroundColor: '#4299e1',
              boxShadow: 'none',
              '&:hover': { 
                backgroundColor: '#3182ce',
                boxShadow: 'none' 
              },
              '&:disabled': {
                backgroundColor: '#e2e8f0',
                color: '#a0aec0'
              }
            }}
          >
            Proceed to Checkout (₹{grandTotal.toFixed(2)})
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
  itemType: CartItem['type'];
}

const CartItemCard = ({ item, onRemove, itemType }: CartItemCardProps) => {
  const getDetailLabel = () => {
    if (isMaidCartItem(item) && item.details?.persons) {
      return `${item.details.persons} person${item.details.persons > 1 ? 's' : ''}`;
    }
    if (isMaidCartItem(item) && item.details?.houseSize) {
      return item.details.houseSize;
    }
    if (isMaidCartItem(item) && item.details?.bathrooms) {
      return `${item.details.bathrooms} bathroom${item.details.bathrooms > 1 ? 's' : ''}`;
    }
    if (isMealCartItem(item) && item.persons) {
      return `${item.persons} person${item.persons > 1 ? 's' : ''}`;
    }
    if (isNannyCartItem(item) && item.age) {
      return `Age ≤${item.age}`;
    }
    return '';
  };

  const getItemType = () => {
    if (isNannyCartItem(item)) {
      return 'Nanny Service';
    }
    if (isMaidCartItem(item)) {
      return item.serviceType === 'package' ? 'Package' : 'Add-on';
    }
    return 'Meal Package';
  };

  const getItemName = () => {
    if (isMaidCartItem(item)) {
      return item.name.replace(/([A-Z])/g, ' $1').trim();
    }
    if (isNannyCartItem(item)) {
      return `${item.careType === 'baby' ? 'Baby' : 'Elderly'} Care - ${item.packageType.charAt(0).toUpperCase() + item.packageType.slice(1)}`;
    }
    if (isMealCartItem(item)) {
      return item.mealType;
    }
    return '';
  };

  return (
    <Box sx={{ 
      mb: 3,
      p: 3,
      borderRadius: '8px',
      border: '1px solid #edf2f7',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      position: 'relative'
    }}>
      <IconButton
        onClick={onRemove}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#e53e3e',
          '&:hover': {
            backgroundColor: 'rgba(229, 62, 62, 0.08)'
          }
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="600" sx={{ 
          color: '#2d3748',
          textTransform: 'capitalize',
          letterSpacing: '0.5px',
          mb: 1.5
        }}>
          {getItemName()} {getItemType()}
        </Typography>
        
        {getDetailLabel() && (
          <Chip 
            label={getDetailLabel()}
            size="small" 
            sx={{ 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2',
              fontWeight: '500',
              borderRadius: '4px'
            }}
          />
        )}
      </Box>
      
      <Typography variant="body2" sx={{ 
        mt: 1.5, 
        mb: 1, 
        color: '#4a5568', 
        fontWeight: '500',
        fontSize: '0.875rem'
      }}>
        Includes:
      </Typography>
      
      <Box component="ul" sx={{ 
        pl: 2.5,
        color: '#4a5568',
        fontSize: '0.875rem',
        '& li': { 
          mb: 0.75,
          position: 'relative',
          pl: '16px',
          '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '8px',
            width: '6px',
            height: '6px',
            backgroundColor: '#4299e1',
            borderRadius: '50%'
          }
        }
      }}>
        {item.description.split('\n').map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </Box>
      
      <Box display="flex" justifyContent="space-between" sx={{ mt: 2.5 }}>
        <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: '500' }}>
          Price:
        </Typography>
        <Typography variant="body2" fontWeight="600" sx={{ color: '#2d3748' }}>
          ₹{item.price.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};