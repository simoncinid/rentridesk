import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.js';
import { PublicSeoPage } from './pages/PublicSeoPage.js';
import { publicPages } from './seo/publicPages.js';
import { CookiePage, PrivacyPage, TermsPage } from './pages/LegalPages.js';

const AppShell = lazy(() => import('./components/AppShell.js').then((m) => ({ default: m.AppShell })));
const LoginPage = lazy(() => import('./pages/AuthPages.js').then((m) => ({ default: m.LoginPage })));
const MfaPage = lazy(() => import('./pages/AuthPages.js').then((m) => ({ default: m.MfaPage })));
const RegisterPage = lazy(() => import('./pages/AuthPages.js').then((m) => ({ default: m.RegisterPage })));
const SimpleAuthPage = lazy(() => import('./pages/AuthPages.js').then((m) => ({ default: m.SimpleAuthPage })));
const Dashboard = lazy(() => import('./pages/Dashboard.js').then((m) => ({ default: m.Dashboard })));
const operationalPage = () => import('./pages/OperationalPages.js');
const AlertsPage = lazy(() => operationalPage().then((m) => ({ default: m.AlertsPage })));
const PartnerAlertsPage = AlertsPage;
const DocumentsPage = lazy(() => operationalPage().then((m) => ({ default: m.DocumentsPage })));
const FirDetailPage = lazy(() => operationalPage().then((m) => ({ default: m.FirDetailPage })));
const FirsPage = lazy(() => operationalPage().then((m) => ({ default: m.FirsPage })));
const MovementsPage = lazy(() => operationalPage().then((m) => ({ default: m.MovementsPage })));
const NewFirPage = lazy(() => operationalPage().then((m) => ({ default: m.NewFirPage })));
const NewMovementPage = lazy(() => operationalPage().then((m) => ({ default: m.NewMovementPage })));
const PartiesPage = lazy(() => operationalPage().then((m) => ({ default: m.PartiesPage })));
const WasteProfilesPage = lazy(() => operationalPage().then((m) => ({ default: m.WasteProfilesPage })));
const systemPage = () => import('./pages/SystemPages.js');
const AuditPage = lazy(() => systemPage().then((m) => ({ default: m.AuditPage })));
const AuthorizationsPage = lazy(() => systemPage().then((m) => ({ default: m.AuthorizationsPage })));
const BillingPage = lazy(() => systemPage().then((m) => ({ default: m.BillingPage })));
const OnboardingPage = lazy(() => systemPage().then((m) => ({ default: m.OnboardingPage })));
const ModulePage = lazy(() => systemPage().then((m) => ({ default: m.ModulePage })));
const RegistersPage = lazy(() => systemPage().then((m) => ({ default: m.RegistersPage })));
const RentriConnectionPage = lazy(() => systemPage().then((m) => ({ default: m.RentriConnectionPage })));
const SettingsPage = lazy(() => systemPage().then((m) => ({ default: m.SettingsPage })));
const TeamPage = lazy(() => systemPage().then((m) => ({ default: m.TeamPage })));

function ScrollToRoute() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
        return;
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <Suspense fallback={<div className="route-loading" aria-label="Caricamento" />}>
      <ScrollToRoute />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      {Object.values(publicPages).map((page) => (
        <Route key={page.path} path={page.path} element={<PublicSeoPage page={page} />} />
      ))}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/cookie" element={<CookiePage />} />
      <Route path="/termini" element={<TermsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<SimpleAuthPage type="verify" />} />
      <Route path="/forgot-password" element={<SimpleAuthPage type="forgot" />} />
      <Route path="/reset-password" element={<SimpleAuthPage type="reset" />} />
      <Route path="/mfa" element={<MfaPage />} />
      <Route path="/app/onboarding" element={<OnboardingPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="registers" element={<RegistersPage />} />
        <Route path="registers/:registerId" element={<MovementsPage />} />
        <Route path="movements" element={<MovementsPage />} />
        <Route path="movements/new" element={<NewMovementPage />} />
        <Route path="movements/:movementId" element={<NewMovementPage />} />
        <Route path="firs" element={<FirsPage />} />
        <Route path="firs/new" element={<NewFirPage />} />
        <Route path="firs/:firId" element={<FirDetailPage />} />
        <Route path="waste-profiles" element={<WasteProfilesPage />} />
        <Route
          path="waste-profiles/new"
          element={
            <ModulePage
              title="Nuovo profilo rifiuto"
              description="Configura il profilo senza confermare automaticamente la classificazione."
            />
          }
        />
        <Route
          path="waste-profiles/:id"
          element={
            <ModulePage
              title="Profilo rifiuto"
              description="Classificazione, documenti e giacenza del profilo."
            />
          }
        />
        <Route path="parties" element={<PartiesPage />} />
        <Route
          path="parties/:id"
          element={
            <ModulePage
              title="Dettaglio soggetto"
              description="Dati, ruoli, autorizzazioni e attività del soggetto esterno."
            />
          }
        />
        <Route path="authorizations" element={<AuthorizationsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="rentri-connection" element={<RentriConnectionPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="billing" element={<BillingPage />} />
      </Route>
      <Route path="/partner/*" element={<AppShell />}>
        <Route
          index
          element={
            <ModulePage
              title="Portale partner"
              description="Vista aggregata dei clienti autorizzati."
            />
          }
        />
        <Route
          path="clients"
          element={
            <ModulePage
              title="Clienti collegati"
              description="Stato operativo, onboarding e accessi concessi dai clienti."
            />
          }
        />
        <Route path="clients/:organizationId" element={<Dashboard />} />
        <Route path="alerts" element={<PartnerAlertsPage />} />
        <Route
          path="templates"
          element={
            <ModulePage
              title="Template verticali"
              description="Proposte configurabili che ogni cliente deve confermare."
            />
          }
        />
      </Route>
      <Route path="/admin/*" element={<AppShell />}>
        <Route
          index
          element={
            <ModulePage
              title="Amministrazione SaaS"
              description="Operazioni tecniche protette per il platform admin."
            />
          }
        />
        {[
          'organizations',
          'users',
          'jobs',
          'integrations',
          'subscriptions',
          'feature-flags',
          'audit',
        ].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <ModulePage
                title={`Admin · ${path}`}
                description="Area riservata, con MFA e audit completo."
              />
            }
          />
        ))}
      </Route>
      <Route
        path="*"
        element={
          <div className="not-found">
            <h1>Pagina non trovata</h1>
            <a href="/app/dashboard">Torna alla panoramica</a>
          </div>
        }
      />
      </Routes>
    </Suspense>
  );
}
