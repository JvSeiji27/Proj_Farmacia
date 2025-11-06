const userController = require("../controllers/userController")
const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authmiddleware")
const { authorizeRoles } = require("../middleware/role_middleware")
const {authMiddlewareToken} = require("../middleware/authmiddleware")
//GET
router.get("/findAll",userController.findAllUsersController)
router.get("/findById/:id", userController.findUserByIdController)
//POST
router.post("/create", userController.createUserController)
//PUT
router.put("/update/:id", userController.updateUserController)
//DELETE
router.delete("/delete/:id",  userController.deleteUserController)

module.exports = router