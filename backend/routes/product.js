const express = require("express");

const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllProductsReviews,
  deleteReview,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { route } = require("./order");

router.route("/products").get(getProducts);

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router.route("/admin/product/:id").get(getSingleProduct);
router.route("/product/:id").get(getSingleProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getAllProductsReviews);
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
