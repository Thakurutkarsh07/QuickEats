import express from "express"
import { placeOrder, verifyOrder ,verifiedOrder} from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/verified",verifiedOrder)

export default orderRouter;