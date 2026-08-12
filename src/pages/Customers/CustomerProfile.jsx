import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  IndianRupee,
  Clock,
  CheckCircle2,
  FileText,
  Download
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Dummy customer data with payment history
const dummyCustomerData = {
  'CUST-001': {
    id: 'CUST-001',
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    altPhone: '+91 9876543211',
    location: 'Anna Nagar, Chennai',
    address: '12/4, 2nd Main Road, Anna Nagar East, Chennai - 600102',
    occupation: 'Business Owner',
    aadharNumber: 'XXXX XXXX 1234',
    panNumber: 'ABCDE1234F',
    status: 'Active',
    joinedDate: '2025-01-15',
    loan: {
      loanId: 'L-001',
      principalAmount: 50000,
      interestType: 'Monthly',
      interestRate: 2,
      remainingPrincipal: 36000,
      startDate: '2026-01-10',
      status: 'Active'
    },
    paymentHistory: [
      { id: 'PAY-104', date: '2026-08-10', totalPaid: 15000, interestPart: 1000, principalPart: 14000, mode: 'UPI', status: 'Completed' },
      { id: 'PAY-103', date: '2026-07-10', totalPaid: 1000, interestPart: 1000, principalPart: 0, mode: 'Cash', status: 'Completed' },
      { id: 'PAY-102', date: '2026-06-10', totalPaid: 1000, interestPart: 1000, principalPart: 0, mode: 'Bank Transfer', status: 'Completed' },
      { id: 'PAY-101', date: '2026-05-10', totalPaid: 1000, interestPart: 1000, principalPart: 0, mode: 'Cash', status: 'Completed' },
    ]
  }
};

export function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cn = (...inputs) => twMerge(clsx(inputs));

  // Default to CUST-001 if id not found in dummy data (for demonstration purposes)
  const customer = dummyCustomerData[id] || dummyCustomerData['CUST-001'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/customers')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{customer.name}</h1>
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
              {customer.status}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Customer ID: {customer.id} • Joined {customer.joinedDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Customer & Loan Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Customer Info Card */}
          <motion.div variants={itemVariants} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <User size={18} className="mr-2 text-blue-500" /> Personal Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Phone size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-200">{customer.phone}</p>
                  <p className="text-xs text-slate-500">Primary</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-200">{customer.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CreditCard size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-200">Aadhar: {customer.aadharNumber}</p>
                  <p className="font-medium text-slate-900 dark:text-slate-200 mt-1">PAN: {customer.panNumber}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active Loan Details */}
          <motion.div variants={itemVariants} className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/30">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <FileText size={18} className="mr-2 text-blue-600 dark:text-blue-400" /> Active Loan
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-blue-200/50 dark:border-blue-800/50">
                <span className="text-sm text-slate-600 dark:text-slate-400">Principal Amount</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <IndianRupee size={14} className="mr-0.5"/> {customer.loan.principalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-blue-200/50 dark:border-blue-800/50">
                <span className="text-sm text-slate-600 dark:text-slate-400">Interest Rate</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {customer.loan.interestRate}% ({customer.loan.interestType})
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Remaining Balance</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <IndianRupee size={18} className="mr-0.5"/> {customer.loan.remainingPrincipal.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Payment History Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="glass-card p-6 min-h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
                <Clock size={18} className="mr-2 text-blue-500" /> Payment History
              </h3>
              <button className="text-sm flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                <Download size={16} className="mr-1" /> Export Statement
              </button>
            </div>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 md:ml-4 space-y-8 pb-4">
              {customer.paymentHistory.map((payment, index) => (
                <div key={payment.id} className="relative pl-6 md:pl-8">
                  {/* Timeline dot */}
                  <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-1 border-2 border-white dark:border-slate-800 shadow-sm"></div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      
                      {/* Date & basic info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{payment.date}</span>
                          <span className="text-xs bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded ml-2">
                            {payment.mode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Receipt No: {payment.id}</p>
                      </div>

                      {/* Payment Split Data */}
                      <div className="flex gap-4 md:gap-8 items-center bg-white dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        <div className="text-center md:text-right">
                          <p className="text-xs text-orange-500 font-medium mb-0.5">Interest Paid</p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center md:justify-end">
                            <IndianRupee size={12}/> {payment.interestPart.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="text-center md:text-right">
                          <p className="text-xs text-emerald-500 font-medium mb-0.5">Principal Paid</p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center md:justify-end">
                            <IndianRupee size={12}/> {payment.principalPart.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="text-center md:text-right">
                          <p className="text-xs text-blue-500 font-medium mb-0.5">Total Paid</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-end">
                            <IndianRupee size={16}/> {payment.totalPaid.toLocaleString()}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
