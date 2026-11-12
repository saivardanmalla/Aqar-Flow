import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  Filter,
  DollarSign,
  Building
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  tenantName: string;
  property: string;
  amount: number;
  paymentType: 'rent' | 'security_deposit' | 'maintenance_fee';
  paymentMethod: 'Bank Transfer' | 'Online Gateway' | 'Cheque' | 'Cash';
  dueDate: string;
  paidDate?: string;
  status: 'completed' | 'pending' | 'overdue';
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-101',
    invoiceNumber: 'INV-2025-001',
    tenantName: 'Ahmed Tariq',
    property: 'Gulberg Heights Unit 402',
    amount: 145000,
    paymentType: 'rent',
    paymentMethod: 'Bank Transfer',
    dueDate: '2025-06-05',
    paidDate: '2025-06-04',
    status: 'completed'
  },
  {
    id: 'pay-102',
    invoiceNumber: 'INV-2025-002',
    tenantName: 'Zainab Mustafa',
    property: 'DHA Phase 6 Villa 12-B',
    amount: 280000,
    paymentType: 'rent',
    paymentMethod: 'Online Gateway',
    dueDate: '2025-06-05',
    paidDate: '2025-06-05',
    status: 'completed'
  },
  {
    id: 'pay-103',
    invoiceNumber: 'INV-2025-003',
    tenantName: 'Hamza Farooq',
    property: 'Bahria Town Signature Office Floor 3',
    amount: 195000,
    paymentType: 'rent',
    paymentMethod: 'Bank Transfer',
    dueDate: '2025-06-10',
    status: 'pending'
  },
  {
    id: 'pay-104',
    invoiceNumber: 'INV-2025-004',
    tenantName: 'Fatima Noor',
    property: 'F-7 Diplomatic Enclave Apt 201',
    amount: 220000,
    paymentType: 'rent',
    paymentMethod: 'Cheque',
    dueDate: '2025-05-30',
    status: 'overdue'
  },
  {
    id: 'pay-105',
    invoiceNumber: 'INV-2025-005',
    tenantName: 'Usman Ali',
    property: 'Clifton Beachside Penthouse PH-1',
    amount: 350000,
    paymentType: 'rent',
    paymentMethod: 'Online Gateway',
    dueDate: '2025-06-01',
    paidDate: '2025-05-31',
    status: 'completed'
  },
  {
    id: 'pay-106',
    invoiceNumber: 'INV-2025-006',
    tenantName: 'Kashif Mehmood',
    property: 'F-10 Commercial Plaza Suite 10',
    amount: 500000,
    paymentType: 'security_deposit',
    paymentMethod: 'Bank Transfer',
    dueDate: '2025-06-02',
    paidDate: '2025-06-02',
    status: 'completed'
  }
];

export const PaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const [newPayment, setNewPayment] = useState({
    tenantName: '',
    property: '',
    amount: 150000,
    paymentType: 'rent' as const,
    paymentMethod: 'Bank Transfer' as const,
    status: 'completed' as const
  });

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = 
      p.tenantName.toLowerCase().includes(search.toLowerCase()) ||
      p.property.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.tenantName || !newPayment.amount) return;

    const record: PaymentRecord = {
      id: `pay-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      tenantName: newPayment.tenantName,
      property: newPayment.property || 'Main Street Property',
      amount: Number(newPayment.amount),
      paymentType: newPayment.paymentType,
      paymentMethod: newPayment.paymentMethod,
      dueDate: new Date().toISOString().split('T')[0],
      paidDate: newPayment.status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
      status: newPayment.status
    };

    setPayments([record, ...payments]);
    setIsRecordModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-[#101B35] tracking-tight">Payments & Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time rent collections, digital invoicing, reconciliation, and automated receipts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Received</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowDownLeft className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-[#10B981] mt-2">
            PKR {(totalCollected / 1000).toLocaleString()}k
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {payments.filter(p => p.status === 'completed').length} cleared invoices this period
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Invoices</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            PKR {(totalPending / 1000).toLocaleString()}k
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Awaiting bank reconciliation
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overdue Balances</span>
            <span className="p-1.5 bg-red-50 text-red-600 rounded-lg"><AlertCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-red-600 mt-2">
            PKR {(totalOverdue / 1000).toLocaleString()}k
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Grace period ended • 1 pending reminder
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice number, tenant, property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'completed', 'pending', 'overdue'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#101B35] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Tenant & Asset</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {record.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#101B35]">{record.tenantName}</div>
                    <div className="text-[11px] text-slate-500">{record.property}</div>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-medium text-slate-700">
                    {record.paymentType.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {record.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 font-black text-[#101B35]">
                    PKR {record.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">
                    {record.dueDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      record.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : record.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {record.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      {record.status === 'pending' && <Clock className="w-3 h-3" />}
                      {record.status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                      <span className="capitalize">{record.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-xl font-black text-[#101B35] tracking-tight">Record Incoming Payment</h2>
            <p className="text-xs text-slate-500 mt-1">Manual payment logging and instant receipt dispatch.</p>

            <form onSubmit={handleRecordPayment} className="space-y-4 mt-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmed Tariq"
                  value={newPayment.tenantName}
                  onChange={(e) => setNewPayment({ ...newPayment, tenantName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Property Name / Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gulberg Heights Unit 402"
                  value={newPayment.property}
                  onChange={(e) => setNewPayment({ ...newPayment, property: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={newPayment.paymentMethod}
                    onChange={(e: any) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#10B981]"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online Gateway">Online Gateway</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

