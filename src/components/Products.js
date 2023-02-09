import { Search } from "@mui/icons-material";
import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard.js";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const exampleProduct = {
    name: "Tan Leatherette Weekender Duffle",
    category: "Fashion",
    cost: 150,
    rating: 4,
    image:
      "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
    _id: "PmInA797xJhMIPti",
  };

  //let products = [];
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [value, setValue] = useState("");
  let timeout;
  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = () => {
    axios
      .get(`${config.endpoint}/products`)
      .then((response) => {
        console.log(response);
        if (response.status == 200) { 
          setProducts(response.data);
          //products = response.data;
          setLoading(false);
          return response.data;
        } else enqueueSnackbar(response.message, { autoHideDuration: 5000 });
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar(error.response.message, { autoHideDuration: 5000 });
      });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true);
    axios
      .get(`${config.endpoint}/products/search?value=${text}`)
      .then((response) => {
        //console.log(response);
        setProducts(response.data);
      })
      .catch((error) => {
        //console.log(error.response);
        setProducts([]);
      });
      setLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

      if(timeout == null){
        timeout = setTimeout(() => {
        performSearch(event.target.value);
      }, debounceTimeout); 
    }
    else{
      clearTimeout(timeout);
        timeout = setTimeout(() => {
          performSearch(event.target.value);
        }, debounceTimeout);  
    }  
  };

  const optimizedDebounce = useCallback(debounceSearch, []);
  useEffect(performAPICall, []);

  return (
    <div>
      <Header>
        <TextField
          className="search-desktop search"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            //performSearch(event.target.value);
            //debounceSearch(event, 500);
            optimizedDebounce(event, 500);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          //performSearch(event.target.value);
          //debounceSearch(event, 500);
          optimizedDebounce(event,500);
        }}
      />

      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>

        {/* <ProductCard product = {exampleProduct} handleAddToCart={performAPICall}/> */}
        {isLoading == true ? (
          <Box className="loading">
            <CircularProgress />
            <p>Loading Products ...</p>
          </Box>
        ) : products.length == 0 ? 
        <Box className="loading">
        <SentimentDissatisfiedTwoToneIcon />
        <p>No products found</p>
      </Box>
        :(
          products.map((productDetails) => {
            return (
              <Grid
                item
                className="product-grid"
                xs={6}
                md={3}
                p={2}
                key={productDetails._id}
              >
                <ProductCard product={productDetails} />
              </Grid>
            );
          })
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
