/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Radio, RadioGroup, Tab, Tabs, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import AddShoppingCartIcon  from '@mui/icons-material/AddShoppingCart';
import { add } from '../../../../features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { CHECKOUT } from '../../../../Constants/pagesConstants';

interface NannyPricingProps {
  onPriceChange: (priceData: { price: number, entry: any }) => void;
  onAddToCart:(priceData: { price: number, selecteditem: any }) => void;  // Add the onPriceChange function as a prop
  pricing : any;
  sendToParent : (data : string) => void;
}

  const NannyPricing =({ onPriceChange , onAddToCart , pricing ,sendToParent }: NannyPricingProps) => {
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [selectedSubCategory , setSelectedSubCategory] = useState<any>();
    const [selectedItemFromNanny , setSelectedItemFromNanny] = useState<any>([])
    const [selecteditem , setSelectedItems] = useState<any>([])
    const [addtoCartSelected , setAddtoCartSelected] = useState<boolean>(false)


    const pric = pricing.reduce((acc: Record<string, any[]>, item: { Categories: string }) => {
      if (!acc[item.Categories]) {
        acc[item.Categories] = [];
      }
      acc[item.Categories].push(item);
      return acc;
    }, {});

    const dispatch = useDispatch();

    const onClickAddToCart = () =>{
      let selecteditem : any = [];
      selecteditem.push(selectedItemFromNanny)
      dispatch(add({ price, selecteditem }));
      setAddtoCartSelected(true)

    }

    const handleOnChange = (data) =>{
      getSelectedSubCategory("")
      setSelectedSubCategory(data);
    }

    const getSelectedSubCategory = (selectedSubCategory) =>{
      setAddtoCartSelected(false)
      if(selectedSubCategory){
      setSelectedItemFromNanny(selectedSubCategory)
      setPrice(selectedSubCategory['Price /Month (INR)'])
      } else {
        setSelectedItemFromNanny([])
        setPrice(0)
      }

      console.log("selec => ",selectedItemFromNanny)
    }

    const handleProceedToCheckout = () =>{
          sendToParent(CHECKOUT)
        }


      
      const typeButtonsSelector = [
        { key: 1, value: 'Regular' },
        { key: 2, value: 'Premium' },
        // { key: 3, value: 'On Demand' }
      ];

  return (
        
       
    <Card
    style={{
      width: '100%',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
    }}
  >
  <Grid container spacing={3}>
  {/* Left Section (Meal Service Info) */}
  <Grid item xs={12} md={8}>
    <Card sx={{ padding: 3, boxShadow: 3 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        sx={{ gap: 1, marginBottom: 2 }}
      >
        {/* <RestaurantMenuIcon color="primary" /> */}
        Service Type
      </Typography>
<Tabs
  // value={serviceType} // Ensure this matches a Tab's value
   // Update the state with the new value
  textColor="primary"
  indicatorColor="primary"
  aria-label="service type tabs"
  sx={{
    backgroundColor: "#f1f1f1",
    borderRadius: "5px 5px 0 0",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    marginBottom: 3,
  }}
>
  {typeButtonsSelector.map((button) => (
    <Tab
      key={button.key}
      value={button.key} // Match the key from typeButtonsSelector
      label={button.value} // Display the value as the label
      // onClick={() => handleForButtonClick(button.key)}
      sx={{
        borderRight: button.key !== typeButtonsSelector[typeButtonsSelector.length - 1].key ? "1px solid #ddd" : '',
        padding: "10px 20px",
        textTransform: "none",
        fontWeight: "bold",
        color: "#444",
        width: "50%",
        "&.Mui-selected": {
          color: "#fff",
          backgroundColor: "#1E90FF",
        },
        "&:hover": {
          backgroundColor: "#ddd",
        },
      }}
    />
  ))}
</Tabs>
 <div style={{display:'flex'}}>
 <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
 <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Categories</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        style={{display:'contents'}}
      >
        {Object.entries(pric).map(([key, value], index) => (
  <FormControlLabel key={index} value={key} control={<Radio />} label={key} onChange={() => handleOnChange(value)}/>
))}
      </RadioGroup>
    </FormControl>
  </Typography>
  {selectedSubCategory && 
  <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
  <FormControl>
       <FormLabel id="demo-radio-buttons-group-label">{selectedSubCategory[0]['Sub-Categories']}
       </FormLabel>
       <RadioGroup
         row
         aria-labelledby="demo-radio-buttons-group-label"
         name="radio-buttons-group"
         style={{display:'contents'}}
       >
         {selectedSubCategory.map((item , index) =>{
          return <FormControlLabel key={index} value={item['Numbers/Size']} control={<Radio />} label={item['Numbers/Size']} onChange={() => getSelectedSubCategory(item)}/>
          
         })}
       </RadioGroup>
     </FormControl>
   </Typography>
  }
  </div>
          </Card>
          </Grid>
          
  {/* Price Card */}
  <Grid item xs={12} md={4}>
  <Card sx={{ padding: 3, textAlign: "center", boxShadow: 3 }}>
    <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
      Total Price
    </Typography>
    <Typography variant="h4" color="green" sx={{ fontWeight: "bold" }}>
      ₹{price}/month
    </Typography>
  
  </Card>
   {/* Add to Cart Button */}
   <Button
    type="submit"
    variant="outlined"
    sx={{
      float: "right",
      margin: "10px",
      height: 50,
      textTransform: "none",
      borderRadius: "25px",
      color: "#1e88e5",
      borderColor: "#1e88e5",
      "&:hover": {
        backgroundColor: "#e3f2fd",
      },
    }}
    endIcon={<AddShoppingCartIcon />}
    onClick={onClickAddToCart}
    disabled={selectedItemFromNanny.length === 0 } // Disable button if any value is not selected
  >
    Add to Cart
  </Button>

  <Button
    type="submit"
    variant="outlined"
    style={{ float: 'right', margin: '10px' }}
    endIcon={<AddShoppingCartIcon />}
    onClick={handleProceedToCheckout}
   disabled={!addtoCartSelected} // Disable the button if no items are selected
  >
    Proceed to checkout
  </Button>
  
   </Grid>
</Grid>
</Card>

 
)
};

export default NannyPricing;
