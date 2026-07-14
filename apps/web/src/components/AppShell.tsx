import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Archive,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  CircleGauge,
  Command,
  FileCheck2,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Menu,
  PackageSearch,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { alerts, organization } from '../data/demo.js';
import { Badge, Button } from './ui.js';

const navigation = [
  [
    'Lavoro',
    [
      ['/app/dashboard', 'Panoramica', LayoutDashboard],
      ['/app/alerts', 'Da fare', Bell, '4'],
      ['/app/firs', 'Formulari FIR', FileText],
      ['/app/movements', 'Movimenti', ReceiptText],
      ['/app/registers', 'Registri', BookOpen],
    ],
  ],
  [
    'Archivio',
    [
      ['/app/waste-profiles', 'Rifiuti configurati', PackageSearch],
      ['/app/parties', 'Soggetti', Building2],
      ['/app/authorizations', 'Autorizzazioni', ShieldCheck],
      ['/app/documents', 'Documenti', Archive],
    ],
  ],
  [
    'Organizzazione',
    [
      ['/app/team', 'Persone e accessi', Users],
      ['/app/rentri-connection', 'Connessione RENTRI', Zap],
      ['/app/settings', 'Impostazioni', Settings],
    ],
  ],
] as const;

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">FO</span>
          <span>
            rentridesk<small>Gestione ambientale</small>
          </span>
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Chiudi menu"
          >
            <X />
          </button>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="organization-switcher">
              <span className="organization-avatar">OA</span>
              <span>
                <b>{organization.name}</b>
                <small>{organization.unit}</small>
              </span>
              <ChevronDown size={14} />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="dropdown" sideOffset={6}>
              <DropdownMenu.Label>Organizzazioni</DropdownMenu.Label>
              <DropdownMenu.Item>✓ {organization.name}</DropdownMenu.Item>
              <DropdownMenu.Item>Carrozzeria Faro S.r.l.</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={() => void navigate('/partner')}>
                Portale partner
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <nav className="sidebar-nav">
          {navigation.map(([group, items]) => (
            <section key={group}>
              <p>{group}</p>
              {items.map(([href, label, Icon, count]) => (
                <NavLink
                  key={href}
                  to={href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => (isActive ? 'nav-active' : '')}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {count && <em>{count}</em>}
                </NavLink>
              ))}
            </section>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/app/audit">
            <CircleGauge size={17} /> Registro attività
          </NavLink>
          <a href="mailto:support@example.invalid">
            <HelpCircle size={17} /> Assistenza
          </a>
          <div className="user-card">
            <span>{organization.initials}</span>
            <div>
              <b>Diego Amato</b>
              <small>{organization.role}</small>
            </div>
            <ChevronDown size={14} />
          </div>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Apri menu"
          >
            <Menu />
          </button>
          <button className="command-search" onClick={() => setSearchOpen(true)}>
            <Search size={16} />
            <span>Cerca FIR, movimenti, soggetti…</span>
            <kbd>⌘ K</kbd>
          </button>
          <div className="top-actions">
            <Badge tone="purple" dot>
              Ambiente demo
            </Badge>
            <button className="icon-button" aria-label="Attività rapide">
              <Command size={18} />
            </button>
            <button
              className="icon-button notification-button"
              onClick={() => setAlertsOpen(true)}
              aria-label="Apri avvisi"
            >
              <Bell size={18} />
              <i>4</i>
            </button>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="command-dialog">
            <Dialog.Title className="sr-only">Ricerca globale</Dialog.Title>
            <div className="command-input">
              <Search />
              <input autoFocus placeholder="Cerca in rentridesk…" aria-label="Ricerca globale" />
              <kbd>ESC</kbd>
            </div>
            <div className="command-results">
              <p>Accesso rapido</p>
              {(
                [
                  ['Nuovo movimento', 'Registra un carico o uno scarico', '/app/movements/new'],
                  ['Nuovo formulario FIR', 'Procedura guidata in 3 passaggi', '/app/firs/new'],
                  ['FIR-2026-0029', 'Da correggere · Batterie al piombo', '/app/firs/fir-3'],
                  [
                    'EcoTrasporti Emilia',
                    'Trasportatore · Autorizzazione in scadenza',
                    '/app/parties/party-1',
                  ],
                ] as const
              ).map(([title, detail, href]) => (
                <button
                  key={title}
                  onClick={() => {
                    void navigate(href);
                    setSearchOpen(false);
                  }}
                >
                  <FileCheck2 size={17} />
                  <span>
                    <b>{title}</b>
                    <small>{detail}</small>
                  </span>
                  <em>↵</em>
                </button>
              ))}
            </div>
            <footer>
              <span>↑↓ per navigare</span>
              <span>↵ per aprire</span>
              <span>Ricerca limitata a {organization.name}</span>
            </footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={alertsOpen} onOpenChange={setAlertsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay subtle" />
          <Dialog.Content className="side-dialog">
            <header>
              <div>
                <Dialog.Title>Da fare</Dialog.Title>
                <Dialog.Description>4 attività richiedono attenzione</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="icon-button">
                  <X />
                </button>
              </Dialog.Close>
            </header>
            <div className="alert-list">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => {
                    void navigate(alert.href);
                    setAlertsOpen(false);
                  }}
                >
                  <span className={`severity-line severity-${alert.severity}`} />
                  <div>
                    <Badge tone={alert.severity}>{alert.due}</Badge>
                    <h3>{alert.title}</h3>
                    <p>{alert.detail}</p>
                  </div>
                </button>
              ))}
            </div>
            <footer>
              <Button
                onClick={() => {
                  void navigate('/app/alerts');
                  setAlertsOpen(false);
                }}
              >
                Apri tutta la coda
              </Button>
            </footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
