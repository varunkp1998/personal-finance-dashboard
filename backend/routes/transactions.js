import express from "express";
import { addTransaction, getTransactions } from "../controllers/transactionController.js";  // ✅ Ensure the names match exactly

const router = express.Router();

router.get("/", getTransactions);
router.post("/add", addTransaction);

export default router;
