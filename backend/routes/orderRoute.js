import express from "express"
import { placeOrder, verifyOrder ,verifiedOrder, usersOrders,listOrder, updateStatus} from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/verified",verifiedOrder)
orderRouter.post("/userorders",authMiddleware,usersOrders)
orderRouter.get("/list",listOrder)
orderRouter.post("/status",updateStatus)
export default orderRouter;