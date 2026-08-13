import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  IndianRupee, 
  User, 
  Calendar,
  CheckCircle2,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Dummy Active Loans mapping to all customers
const initialActiveLoans = [
  { id: 'L-001', customerName: 'Rajesh Kumar', principalAmount: 500000, interestType: 'Monthly', interestRate: 2, remainingPrincipal: 500000, interestDue: 10000, nextDueDate: '2026-08-10', repaymentType: 'Monthly', loanGivenDate: '2026-01-10', payments: [1, 2, 3, 4, 5, 6, 7] }, // 7 months passed
  { id: 'L-002', customerName: 'Priya Sharma', principalAmount: 250000, interestType: 'Monthly', interestRate: 2, remainingPrincipal: 200000, interestDue: 4000, nextDueDate: '2026-08-07', repaymentType: 'Weekly', loanGivenDate: '2026-07-01', payments: [1, 2, 3, 4] },
  { id: 'L-003', customerName: 'Mohammed Ali', principalAmount: 1000000, interestType: 'Monthly', interestRate: 1.5, remainingPrincipal: 1000000, interestDue: 15000, nextDueDate: '2026-08-15', repaymentType: 'Monthly', loanGivenDate: '2026-07-15', payments: [] },
  { id: 'L-004', customerName: 'Suresh Menon', principalAmount: 150000, interestType: 'Weekly', interestRate: 1, remainingPrincipal: 150000, interestDue: 1500, nextDueDate: '2026-08-12', repaymentType: 'Daily', loanGivenDate: '2026-08-01', payments: [1, 2, 3] }, // 3 days paid, out of 9 days = 6 pending
  { id: 'L-005', customerName: 'Anita Desai', principalAmount: 750000, interestType: 'Monthly', interestRate: 2, remainingPrincipal: 700000, interestDue: 14000, nextDueDate: '2026-08-20', repaymentType: 'Monthly', loanGivenDate: '2026-06-20', payments: [1] }
];

export function Collections() {
  const [loans, setLoans] = useState(initialActiveLoans);
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('Interest + Principal');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const cn = (...inputs) => twMerge(clsx(inputs));

  const selectedLoan = loans.find(loan => loan.id === selectedLoanId);

  const calculatePending = (loan) => {
    if (!loan || !loan.loanGivenDate) return { count: 0, label: 'Up to date' };
    const givenDate = new Date(loan.loanGivenDate);
    const now = new Date('2026-08-10'); // using current app context date
    const diffTime = Math.abs(now - givenDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let expectedPayments = 0;
    let periodLabel = '';
    
    if (loan.repaymentType === 'Daily') {
      expectedPayments = diffDays;
      periodLabel = 'days';
    } else if (loan.repaymentType === 'Weekly') {
      expectedPayments = Math.floor(diffDays / 7);
      periodLabel = 'weeks';
    } else if (loan.repaymentType === 'Monthly') {
      expectedPayments = Math.floor(diffDays / 30);
      periodLabel = 'months';
    }
    
    const actualPayments = loan.payments.length;
    const pendingCount = expectedPayments - actualPayments;
    
    if (pendingCount > 0) return { count: pendingCount, label: `${pendingCount} ${periodLabel} pending`, isPending: true };
    if (pendingCount < 0) return { count: pendingCount, label: `${Math.abs(pendingCount)} ${periodLabel} advanced`, isPending: false };
    return { count: 0, label: 'Up to date', isPending: false };
  };

  const pendingStatus = calculatePending(selectedLoan);

  // Auto-calculation logic
  let calculatedInterest = 0;
  let calculatedPrincipal = 0;
  let newRemainingPrincipal = selectedLoan ? selectedLoan.remainingPrincipal : 0;

  const numPaymentAmount = parseFloat(paymentAmount) || 0;

  if (selectedLoan && numPaymentAmount > 0) {
    if (paymentType === 'Interest Only') {
      calculatedInterest = numPaymentAmount;
      calculatedPrincipal = 0;
      newRemainingPrincipal = selectedLoan.remainingPrincipal;
    } else if (paymentType === 'Principal Only') {
      calculatedInterest = 0;
      calculatedPrincipal = numPaymentAmount;
      newRemainingPrincipal = selectedLoan.remainingPrincipal - calculatedPrincipal;
    } else {
      // Interest + Principal
      if (numPaymentAmount >= selectedLoan.interestDue) {
        calculatedInterest = selectedLoan.interestDue;
        calculatedPrincipal = numPaymentAmount - selectedLoan.interestDue;
      } else {
        // If payment is less than interest due, it all goes to interest
        calculatedInterest = numPaymentAmount;
        calculatedPrincipal = 0;
      }
      newRemainingPrincipal = selectedLoan.remainingPrincipal - calculatedPrincipal;
    }
    
    // Prevent negative principal
    if (newRemainingPrincipal < 0) newRemainingPrincipal = 0;
  }

  const handleConfirmPayment = () => {
    if (!selectedLoan || numPaymentAmount <= 0) return;
    
    const updatedLoans = loans.map(loan => {
      if (loan.id === selectedLoan.id) {
        return {
          ...loan,
          remainingPrincipal: newRemainingPrincipal,
          interestDue: loan.interestDue - calculatedInterest,
          payments: [...loan.payments, 1] // Add a mock payment record
        };
      }
      return loan;
    });
    
    setLoans(updatedLoans);
    setPaymentAmount('');
    alert('Payment confirmed successfully!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Collection</h1>
        <p className="text-slate-500 dark:text-slate-400">Collect payments and automatically calculate remaining balances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Form */}
        <div className="glass-card p-6 space-y-6">
          
          {/* Loan Selection & Filters */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Customer / Loan</label>
              
              {/* Type Filter */}
              <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-auto">
                {['All', 'Daily', 'Weekly', 'Monthly'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setIsDropdownOpen(true);
                    }}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                      filterType === type 
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search by name or loan ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="w-full p-3 pl-10 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white"
                />
                <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                  {loans
                    .filter(loan => 
                      (filterType === 'All' || loan.repaymentType === filterType) &&
                      (loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       loan.id.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map(loan => (
                    <div 
                      key={loan.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedLoanId(loan.id);
                        setSearchQuery(`${loan.customerName} (${loan.id})`);
                        setIsDropdownOpen(false);
                      }}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 last:border-0 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white">{loan.customerName}</span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                          {loan.repaymentType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                        <span>{loan.id}</span>
                        <span>₹{loan.principalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {loans.filter(loan => 
                      (filterType === 'All' || loan.repaymentType === filterType) &&
                      (loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       loan.id.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length === 0 && (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No customers found matching your criteria.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedLoan && (
            <>
              {/* Payment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Interest + Principal', 'Interest Only', 'Principal Only'].map(type => (
                    <button
                      key={type}
                      onClick={() => setPaymentType(type)}
                      className={cn(
                        "py-2 px-1 text-xs font-medium rounded-lg border transition-all text-center",
                        paymentType === type 
                          ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-500" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount Received (₹)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full p-3 pl-10 text-xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white"
                  />
                  <IndianRupee className="absolute left-3 top-4 text-slate-400" size={20} />
                </div>
              </div>

              {/* Payment Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full p-3 pl-10 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-white appearance-none"
                  />
                  <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleConfirmPayment}
                className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                <CheckCircle2 size={20} />
                Confirm Payment
              </button>
            </>
          )}

        </div>

        {/* Right Column: Calculations & Summary */}
        <div className="space-y-6">
          {selectedLoan ? (
            <>
              {/* Current Status Card */}
              <div className="glass-card p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                  <FileText size={16} className="mr-2" /> Current Loan Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Remaining Principal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{selectedLoan.remainingPrincipal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Interest Due ({selectedLoan.interestType})</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">₹{selectedLoan.interestDue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Repayment Schedule</span>
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {selectedLoan.repaymentType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Payment Status</span>
                    <span className={cn(
                      "font-medium px-2 py-0.5 rounded-full text-xs",
                      pendingStatus.isPending 
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    )}>
                      {pendingStatus.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Calculation Preview */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 border-blue-200 dark:border-blue-800/50 relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 text-blue-50 dark:text-blue-900/20">
                  <Calculator size={100} />
                </div>
                <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4 relative z-10">
                  Auto Calculation Preview
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                    <span className="text-sm text-slate-500">Total Received</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">₹{numPaymentAmount.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                      <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Towards Interest</p>
                      <p className="font-semibold text-orange-700 dark:text-orange-300">₹{calculatedInterest.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Towards Principal</p>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-300">₹{calculatedPrincipal.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-medium text-slate-700 dark:text-slate-300">New Remaining Principal</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{newRemainingPrincipal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="glass-card h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Calculator size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
              <p>Select a customer loan to view details and calculate payments.</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
