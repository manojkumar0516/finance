import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// --- CUSTOMERS API ---
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { loans: true }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    const newCustomer = await prisma.customer.create({
      data: { name, phone, location }
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// --- LOANS API ---
app.get('/api/loans', async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      include: { customer: true }
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

app.post('/api/loans', async (req, res) => {
  try {
    const { customerId, principalAmount, interestRate, interestType, repaymentType, loanGivenDate } = req.body;
    const newLoan = await prisma.loan.create({
      data: {
        customerId,
        principalAmount,
        remainingPrincipal: principalAmount,
        interestRate,
        interestType,
        repaymentType,
        loanGivenDate: new Date(loanGivenDate)
      }
    });
    res.status(201).json(newLoan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create loan' });
  }
});

// --- PAYMENTS API ---
app.post('/api/payments', async (req, res) => {
  try {
    const { loanId, customerId, amount, principalPaid, interestPaid, paymentType } = req.body;
    
    // We should do this in a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create payment record
      const payment = await prisma.payment.create({
        data: {
          loanId,
          customerId,
          amount,
          principalPaid,
          interestPaid,
          paymentType,
        }
      });

      // 2. Update loan remaining balance
      const updatedLoan = await prisma.loan.update({
        where: { id: loanId },
        data: {
          remainingPrincipal: { decrement: principalPaid },
          interestDue: { decrement: interestPaid }
        }
      });

      return { payment, updatedLoan };
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
