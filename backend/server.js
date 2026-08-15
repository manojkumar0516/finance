import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './postgresql.js';

dotenv.config();

const app = express();
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
      include: {
        loans: {
          orderBy: { loanGivenDate: 'desc' },
          take: 1,
          include: { _count: { select: { payments: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(customers.map((customer) => {
      const loan = customer.loans[0];
      return {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        location: customer.location || 'N/A',
        status: customer.status,
        loanAmount: loan?.principalAmount ?? 0,
        remainingBalance: loan?.remainingPrincipal ?? 0,
        repaymentType: loan?.repaymentType ?? 'N/A',
        loanGivenDate: loan?.loanGivenDate ?? null,
        paymentsCount: loan?._count.payments ?? 0,
      };
    }));
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, phone, location, loanAmount, repaymentType, loanGivenDate } = req.body;
    const parsedLoanAmount = Number(loanAmount) || 0;

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    const newCustomer = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          name: name.trim(),
          phone: phone?.trim() || 'N/A',
          location: location?.trim() || null,
        },
      });

      if (parsedLoanAmount > 0) {
        await tx.loan.create({
          data: {
            customerId: customer.id,
            principalAmount: parsedLoanAmount,
            remainingPrincipal: parsedLoanAmount,
            interestRate: 0,
            interestType: 'Monthly',
            repaymentType: repaymentType || 'Monthly',
            loanGivenDate: loanGivenDate ? new Date(loanGivenDate) : new Date(),
          },
        });
      }

      return tx.customer.findUnique({
        where: { id: customer.id },
        include: { loans: { include: { _count: { select: { payments: true } } } } },
      });
    });

    const loan = newCustomer.loans[0];
    res.status(201).json({
      id: newCustomer.id,
      name: newCustomer.name,
      phone: newCustomer.phone,
      location: newCustomer.location || 'N/A',
      status: newCustomer.status,
      loanAmount: loan?.principalAmount ?? 0,
      remainingBalance: loan?.remainingPrincipal ?? 0,
      repaymentType: loan?.repaymentType ?? 'N/A',
      loanGivenDate: loan?.loanGivenDate ?? null,
      paymentsCount: loan?._count.payments ?? 0,
    });
  } catch (error) {
    console.error('Failed to create customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { customerId: req.params.id } }),
      prisma.loan.deleteMany({ where: { customerId: req.params.id } }),
      prisma.customer.delete({ where: { id: req.params.id } }),
    ]);
    res.status(204).end();
  } catch (error) {
    console.error('Failed to delete customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
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
