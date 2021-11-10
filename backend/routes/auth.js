const express = require('express');
const router = express.Router();


const { 
    registerUser, 
    loginUser, 
    forgotPassword, 
    resetPassword, 
    getUserProfile,
    updatePassword,
    updateProfile,
    getUserDetail,
    allUsers,
    updateUser,
    deleteUser,
    logout 
} = require("../controllers/authController");

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").post(resetPassword);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles('admin'), allUsers);

router.route("/admin/user/:id")
.get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetail)
.put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

router.route("/logout").get(logout);

module.exports = router;