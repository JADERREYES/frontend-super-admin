import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareShare,
  Plus,
  RefreshCw,
  Settings,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { authService } from './services/auth.service';
import { alertsService } from './services/alerts.service';
import { premiumRequestsService } from './services/premium-requests.service';
import { apiConfig } from './config/api';
import { cx, Loading, Modal } from './components/shared/ui';
import type { AdminPage } from './types/admin';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { UsersPage } from './pages/users/UsersPage';
import { SubscriptionsPage } from './pages/subscriptions/SubscriptionsPage';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { PlansPage } from './pages/PlansPage';
import { SubscriptionRequestsPage } from './pages/SubscriptionRequestsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { AlertsPage } from './pages/alerts/AlertsPage';
import { ActivityPage } from './pages/activity/ActivityPage';
import { SettingsPage } from './pages/settings/SettingsPage';

type NavItem = {
  id: Exclude<AdminPage, 'login'>;
  label: string;
  icon: ReactNode;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const pendingSubscriptionStatuses = [
  'new',
  'receipt_uploaded',
  'submitted',
  'under_review',
  'contacted',
  'pending_payment',
  'paid',
  'awaiting_validation',
];

const navGroups: NavGroup[] = [
  {
    title: 'Operacion',
    items: [
      { id: 'dashboard' as const, label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
      { id: 'users' as const, label: 'Usuarios', icon: <Users className="h-5 w-5" /> },
      { id: 'activity' as const, label: 'Actividad / Auditoria', icon: <Activity className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Atencion',
    items: [
      { id: 'alerts' as const, label: 'Alertas', icon: <ShieldAlert className="h-5 w-5" /> },
      { id: 'documents' as const, label: 'Documentos / RAG', icon: <FileText className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Ingresos',
    items: [
      { id: 'subscriptionRequests' as const, label: 'Solicitudes premium', icon: <MessageSquareShare className="h-5 w-5" /> },
      { id: 'subscriptions' as const, label: 'Suscripciones', icon: <CreditCard className="h-5 w-5" /> },
      { id: 'paymentMethods' as const, label: 'Metodos de pago', icon: <CreditCard className="h-5 w-5" /> },
      { id: 'plans' as const, label: 'Planes', icon: <Plus className="h-5 w-5" /> },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { id: 'settings' as const, label: 'Configuracion y seguridad', icon: <Settings className="h-5 w-5" /> },
    ],
  },
];

const nav = navGroups.flatMap((group) => group.items);

export default function App() {
  const [page, setPage] = useState<AdminPage>('login');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [userName, setUserName] = useState('Admin');
  const [alertsCount, setAlertsCount] = useState(0);
  const [premiumPendingCount, setPremiumPendingCount] = useState(0);
  const [booting, setBooting] = useState(true);

  const loadAlertCount = async () => {
    if (!authService.isAuthenticated()) return;
    try {
      const alerts = await alertsService.getAll();
      setAlertsCount(alerts.filter((item: any) => item.status !== 'resolved').length);
    } catch {
      setAlertsCount(0);
    }
  };

  const loadPremiumCount = async () => {
    if (!authService.isAuthenticated()) return;
    try {
      const items = await premiumRequestsService.getAll();
      setPremiumPendingCount(
        items.filter((item) => pendingSubscriptionStatuses.includes(item.status)).length,
      );
    } catch {
      setPremiumPendingCount(0);
    }
  };

  const refreshBadges = async () => {
    await Promise.all([loadAlertCount(), loadPremiumCount()]);
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!authService.isAuthenticated()) {
        setBooting(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        if (profile.role !== 'superadmin') {
          authService.logout();
          setPage('login');
          setAlertsCount(0);
          setPremiumPendingCount(0);
        } else {
          setUserName(profile.name || profile.email?.split('@')[0] || 'Admin');
          localStorage.setItem(apiConfig.storage.profileKey, JSON.stringify(profile));
          setPage('dashboard');
          await refreshBadges();
        }
      } catch {
        authService.logout();
        setPage('login');
        setAlertsCount(0);
        setPremiumPendingCount(0);
      } finally {
        setBooting(false);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    if (page === 'login' || !authService.isAuthenticated()) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshBadges();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [page]);

  const goToPage = (nextPage: AdminPage) => {
    setPage(nextPage);
    setMobileOpen(false);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage onNavigate={goToPage} />;
      case 'users':
        return <UsersPage />;
      case 'subscriptions':
        return <SubscriptionsPage />;
      case 'paymentMethods':
        return <PaymentMethodsPage />;
      case 'plans':
        return <PlansPage />;
      case 'subscriptionRequests':
        return <SubscriptionRequestsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'alerts':
        return <AlertsPage onCountChange={setAlertsCount} />;
      case 'activity':
        return <ActivityPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={goToPage} />;
    }
  };

  if (booting) return <Loading label="Validando sesion administrativa..." />;
  if (page === 'login') {
    return (
      <LoginPage
        onLogin={(user) => {
          setUserName(user?.name || user?.email?.split('@')[0] || 'Admin');
          setPage('dashboard');
          void refreshBadges();
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {mobileOpen ? <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
      <aside className={cx('fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:static', mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', sidebarOpen ? 'w-64' : 'w-20')}>
        <div className={cx('flex h-16 items-center gap-3 border-b border-slate-200', sidebarOpen ? 'px-6' : 'justify-center px-4')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600"><Heart className="h-5 w-5 text-white" /></div>
          {sidebarOpen ? <div><h1 className="font-bold text-slate-900">MenteAmiga-AI</h1><p className="text-xs text-slate-500">Super Admin</p></div> : null}
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {sidebarOpen ? <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{group.title}</p> : null}
              {group.items.map((item) => (
                <button key={item.id} onClick={() => goToPage(item.id)} className={cx('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium', page === item.id ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-100' : 'text-slate-600 hover:bg-slate-50', !sidebarOpen && 'justify-center')}>
                  {item.icon}
                  {sidebarOpen ? (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.id === 'alerts' && alertsCount ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">{alertsCount}</span> : null}
                      {item.id === 'subscriptionRequests' && premiumPendingCount ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{premiumPendingCount}</span> : null}
                    </>
                  ) : null}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <button onClick={() => setLogoutOpen(true)} className={cx('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50', !sidebarOpen && 'justify-center')}><LogOut className="h-5 w-5" />{sidebarOpen ? <span>Cerrar sesion</span> : null}</button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5 text-slate-600" /></button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden rounded-lg p-2 hover:bg-slate-100 lg:block">{sidebarOpen ? <ChevronLeft className="h-5 w-5 text-slate-600" /> : <ChevronRight className="h-5 w-5 text-slate-600" />}</button>
            <span className="hidden text-sm font-medium text-slate-900 md:block">{nav.find((item) => item.id === page)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => void refreshBadges()} className="rounded-lg p-2 hover:bg-slate-100"><RefreshCw className="h-5 w-5 text-slate-600" /></button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="hidden text-right md:block"><p className="text-sm font-medium text-slate-900">{userName}</p><p className="text-xs text-slate-500">Super Admin</p></div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{renderPage()}</main>
      </div>
      <Modal open={logoutOpen} title="Cerrar sesion" onClose={() => setLogoutOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Tu sesion administrativa sera cerrada.</p>
          <div className="flex gap-3">
            <button onClick={() => setLogoutOpen(false)} className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700">Cancelar</button>
            <button onClick={() => { authService.logout(); setLogoutOpen(false); setPage('login'); setAlertsCount(0); setPremiumPendingCount(0); }} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm text-white">Cerrar sesion</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
