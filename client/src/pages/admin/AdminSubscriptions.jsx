import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { adminApi } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Badge from '../../components/ui/Badge';
import { formatDistanceToNow, format } from 'date-fns';
import { CreditCard, History, RefreshCcw } from 'lucide-react';

const AdminSubscriptions = () => {
  useDocumentTitle('Admin | Subscriptions & Finances');

  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' or 'transactions'
  
  const [isLoadingSubs, setIsLoadingSubs] = useState(true);
  const [errorSubs, setErrorSubs] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  const [isLoadingTrans, setIsLoadingTrans] = useState(true);
  const [errorTrans, setErrorTrans] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoadingSubs(true);
        const res = await adminApi.getSubscriptions();
        setSubscriptions(res.data.subscriptions);
      } catch (err) {
        setErrorSubs(err);
      } finally {
        setIsLoadingSubs(false);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (activeTab !== 'transactions' && transactions.length === 0) return;
      if (transactions.length > 0) return; // Already fetched

      try {
        setIsLoadingTrans(true);
        const res = await adminApi.getTransactions();
        setTransactions(res.data.transactions);
      } catch (err) {
        setErrorTrans(err);
      } finally {
        setIsLoadingTrans(false);
      }
    };

    fetchTransactions();
  }, [activeTab, transactions.length]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary font-display tracking-tight mb-2">
          Subscriptions & Finances
        </h1>
        <p className="text-text-muted font-medium">
          Track active subscribers and recent Stripe transactions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-surface-elevated">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'subscriptions'
              ? 'text-primary border-primary'
              : 'text-text-muted border-transparent hover:text-text-primary hover:border-surface-elevated'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Active Subscribers
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'transactions'
              ? 'text-primary border-primary'
              : 'text-text-muted border-transparent hover:text-text-primary hover:border-surface-elevated'
          }`}
        >
          <History className="w-4 h-4" />
          Recent Transactions
        </button>
      </div>

      <div className="bg-surface border border-surface-elevated rounded-xl shadow-sm overflow-hidden min-h-[400px] relative">
        {activeTab === 'subscriptions' && (
          <div className="overflow-x-auto">
            {isLoadingSubs ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="md" />
              </div>
            ) : errorSubs ? (
              <div className="p-8">
                <ErrorMessage message="Failed to load subscriptions" error={errorSubs} onRetry={() => window.location.reload()} />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-elevated/50 text-text-muted text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Stripe Customer ID</th>
                    <th className="px-6 py-4 font-semibold">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-elevated text-sm">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-text-muted">
                        No active or past due subscriptions found.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-surface-elevated/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-text-primary">{sub.name}</div>
                          <div className="text-text-muted text-xs">{sub.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              sub.subscriptionStatus === 'active'
                                ? 'success'
                                : sub.subscriptionStatus === 'past_due'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {sub.subscriptionStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-mono text-text-muted text-xs">
                          {sub.stripeCustomerId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-text-muted">
                          {formatDistanceToNow(new Date(sub.updatedAt), { addSuffix: true })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            {isLoadingTrans ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="md" />
              </div>
            ) : errorTrans ? (
              <div className="p-8">
                <ErrorMessage message="Failed to load transactions" error={errorTrans} onRetry={() => window.location.reload()} />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-elevated/50 text-text-muted text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-elevated text-sm">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                        No recent transactions found on Stripe.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-elevated/20 transition-colors">
                        <td className="px-6 py-4 text-text-primary whitespace-nowrap">
                          {format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="px-6 py-4 text-text-muted">
                          {tx.receiptEmail}
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-text-primary">
                          ${tx.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              tx.refunded
                                ? 'warning'
                                : tx.paid
                                ? 'success'
                                : 'error'
                            }
                          >
                            {tx.refunded ? 'Refunded' : tx.paid ? 'Paid' : tx.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-mono text-text-muted text-xs">
                          {tx.id}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptions;
