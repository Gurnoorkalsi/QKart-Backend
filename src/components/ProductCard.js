import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        sx={{ maxHeight: "40vh" }}
        component="img"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="body1">{product.name}</Typography>
        <Typography variant="h6">{`$ ${product.cost}`}</Typography>
        <Rating name="name-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions className="card-actions">
        <Button
          className="card-button"
          variant="contained"
          onClick={handleAddToCart}
          startIcon={<AddShoppingCartOutlined />}
          fullWidth={true}
        >Add to Cart</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
