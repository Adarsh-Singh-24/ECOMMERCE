import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFiles from "../middlewares/multer.js";
import { createProduct, updateProductImage } from "../controller/Product.js";
import { getAllProducts } from "../controller/Product.js";
import { getSingleProduct } from "../controller/Product.js";
import { updateProduct } from "../controller/Product.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all" , getAllProducts);
router.get("/product/:id" , getSingleProduct);
router.put("/product/:id" , isAuth, updateProduct);
router.post("/product/:id" , isAuth, uploadFiles ,  updateProductImage);

export default router;