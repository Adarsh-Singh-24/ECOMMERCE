import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFiles from "../middlewares/multer.js";
import { createProduct, updateProductImage } from "../controller/product.js";
import { getAllProducts } from "../controller/product.js";
import { getSingleProduct } from "../controller/product.js";
import { updateProduct } from "../controller/product.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all" , getAllProducts);
router.get("/product/:id" , getSingleProduct);
router.put("/product/:id" , isAuth, updateProduct);
router.post("/product/:id" , isAuth, uploadFiles ,  updateProductImage);

export default router;