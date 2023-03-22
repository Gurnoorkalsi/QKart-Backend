import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useRef } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard.js";
import Cart, { generateCartItemsFrom } from "./Cart";

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
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

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [value, setValue] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [token, setToken] = useState(window.localStorage.token);
  //const [cartItems, setCartItems] = useState([]);
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
  //useEffect(()=>{performAPICall();}, []);

  const performAPICall = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.endpoint}/products`);
      if (response.status === 200) {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
        return response.data;
      } else enqueueSnackbar(response.message, { autoHideDuration: 5000 });
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.message, {
          autoHideDuration: 5000,
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
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
        setFilteredProducts(response.data);
      })
      .catch((error) => {
        //console.log(error.response);
        setFilteredProducts([]);
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
    //   if(timeout == null){
    //     timeout = setTimeout(() => {
    //     performSearch(event.target.value);
    //   }, debounceTimeout);
    // }
    // else{
    //   clearTimeout(timeout);
    //     timeout = setTimeout(() => {
    //       performSearch(event.target.value);
    //     }, debounceTimeout);
    // }
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    setDebounceTimeout(timeout);
  };

  // const optimizedDebounce = useCallback(debounceSearch, []);
  // useEffect(performAPICall, []);

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} toeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNyaW8uZG8iLCJpYXQiOjE2Nzc1ODQwNTAsImV4cCI6MTY3NzYwNTY1MH0.L4gH3CpB9wMZjMRHLE3-RDdqrAYmzHvzHefSTfziuN0ken - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return null;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      return await axios.get(`${config.endpoint}/cart`,{
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        setItems(response.data);

        console.log(response);
        return response.data;
      });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };
  //let cartinFlux = [];
  //useEffect(() => {cartinFlux = fetchCart(window.localStorage.token)},[]);
  //setCartItems(generateCartItemsFrom(cartinFlux, products));

  useEffect(() => {
    const onLoadHandler = async () => {
      const productData = await performAPICall();
        const cartData = await fetchCart(window.localStorage.token);
        const result = generateCartItemsFrom(cartData, productData);
        console.log(result);
        setCartItems(result);
    };
    
    onLoadHandler();
  }, []);
  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.find((item) => item.productId == productId) ? true : false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    const item = isItemInCart(items, productId);
    //console.log(items.find(product => product.productId === productId));
    if (item && qty === 1 && items.find(product => product.productId === productId).qty !== 2) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
    } else {
      axios
        .post(
          `${config.endpoint}/cart`,
          {
            productId: productId,
            qty: qty,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setItems(response.data);
          console.log(response.data);
          const result = generateCartItemsFrom(response.data, products);
          setCartItems(result);
        })
        .catch((e) => {
          if (e.response && e.response.status === 400) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          } else {
              if(items.find(product => product.productId === productId)){
                enqueueSnackbar(
                  "Item already in cart. Use the cart sidebar to update quantity or remove item.",
                  { variant: "warning" }
                );
              }
              enqueueSnackbar(
                "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
                {
                  variant: "error",
                }
              );
  
          }
        });
    }
  };

  return (
    <>
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
            debounceSearch(event, debounceTimeout);
            //optimizedDebounce(event, 500);
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
          debounceSearch(event, debounceTimeout);
          //optimizedDebounce(event,500);
        }}
      />
      <Box className="product-area">
        <Box className="products">
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>

            {/* <ProductCard product = {exampleProduct} handleAddToCart={performAPICall}/> */}
            {isLoading === true ? (
              <Box className="loading">
                <CircularProgress />
                <p>Loading Products ...</p>
              </Box>
            ) : filteredProducts.length == 0 ? (
              <Box className="loading">
                <SentimentDissatisfied />
                <p>No products found</p>
              </Box>
            ) : (
              filteredProducts.map((productDetails) => {
                return (
                  <Grid
                    item
                    className="product-grid"
                    xs={6}
                    md={3}
                    p={2}
                    key={productDetails._id}
                  >
                    <ProductCard
                      product={productDetails}
                      handleAddToCart={() => {
                        addToCart(
                          token,
                          items,
                          products,
                          productDetails._id,
                          1
                        );
                      }}
                    />
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
        {window.localStorage.username != null && (
          <Box className="cartContainer">
            <Cart
              sx={{ margin: "20px" }}
              products={products}
              items={cartItems}
              handleQuantity={addToCart}
            />
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Products;
