import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Cloud,
  FilePlus2,
  Plus,
  ReceiptText,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { activity, alerts, firs, wasteProfiles } from '../data/demo.js';
import { Badge, Button, DataTable, Metric, PageHeader, SectionHeader } from '../components/ui.js';

const toneForStatus = (status: string) =>
  status.includes('errore') || status.includes('correggere')
    ? 'danger'
    : status.includes('ricevuta') || status.includes('Conservato')
      ? 'success'
      : status.includes('viaggio')
        ? 'info'
        : 'neutral';

export function Dashboard() {
  return (
    <div className="page dashboard-page">
      <PageHeader
        eyebrow="Martedì 14 luglio"
        title="Buongiorno, Diego"
        description="Ecco cosa richiede attenzione nella tua officina."
        actions={
          <>
            <Link to="/app/movements/new">
              <Button>
                <Plus size={16} /> Registra movimento
              </Button>
            </Link>
            <Link to="/app/firs/new">
              <Button variant="primary">
                <FilePlus2 size={16} /> Nuovo FIR
              </Button>
            </Link>
          </>
        }
      />
      <div className="demo-banner">
        <Sparkles size={18} />
        <div>
          <b>Stai lavorando in modalità dimostrativa</b>
          <span>Nessun dato viene inviato a RENTRI. Puoi provare liberamente tutti i flussi.</span>
        </div>
        <button>
          Scopri la modalità demo <ArrowRight size={14} />
        </button>
      </div>
      <section>
        <SectionHeader
          title="Da fare"
          meta="3 attività prioritarie"
          action={
            <Link to="/app/alerts">
              Vedi tutto <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="action-grid">
          {alerts.slice(0, 3).map((alert, index) => (
            <Link to={alert.href} className="action-card" key={alert.id}>
              <span className={`action-icon action-${alert.severity}`}>
                {index === 0 ? <CircleAlert /> : index === 1 ? <RefreshCw /> : <ShieldAlert />}
              </span>
              <div>
                <Badge tone={alert.severity}>{alert.due}</Badge>
                <h3>{alert.title}</h3>
                <p>{alert.detail}</p>
                <span className="card-link">
                  Apri attività <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="metrics">
        <Metric label="FIR questo mese" value="12" detail="3 ancora in corso" tone="violet" />
        <Metric label="Movimenti" value="67" detail="3 da trasmettere" tone="blue" />
        <Metric
          label="Quantità caricate"
          value="1.284 kg"
          detail="+8% dal mese scorso"
          tone="teal"
        />
        <Metric label="Anomalie aperte" value="2" detail="1 richiede intervento" tone="amber" />
      </section>
      <div className="dashboard-grid">
        <section className="panel fir-panel">
          <SectionHeader
            title="Formulari recenti"
            meta="4 aggiornamenti"
            action={
              <Link to="/app/firs">
                Tutti i FIR <ArrowRight size={14} />
              </Link>
            }
          />
          <div className="fir-list">
            {firs.slice(0, 3).map((fir) => (
              <Link to={`/app/firs/${fir.id}`} key={fir.id}>
                <div className="fir-main">
                  <span className="fir-doc-icon">
                    <ReceiptText size={18} />
                  </span>
                  <div>
                    <b>{fir.internalNumber}</b>
                    <small>
                      {fir.wasteCode} · {fir.waste}
                    </small>
                  </div>
                </div>
                <div className="fir-party">
                  <Truck size={14} />
                  <span>{fir.carrier}</span>
                </div>
                <div className="fir-status">
                  <Badge tone={toneForStatus(fir.status)} dot>
                    {fir.status}
                  </Badge>
                  <small>{fir.updatedAt}</small>
                </div>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </section>
        <section className="panel connection-panel">
          <SectionHeader title="Connessione RENTRI" />
          <div className="connection-status">
            <span>
              <Cloud />
            </span>
            <div>
              <Badge tone="success" dot>
                Operativa
              </Badge>
              <h3>Ambiente dimostrativo</h3>
              <p>Ultimo controllo riuscito 2 minuti fa</p>
            </div>
          </div>
          <dl>
            <div>
              <dt>Operatore</dt>
              <dd>DEMO-OP-09281</dd>
            </div>
            <div>
              <dt>Unità locale</dt>
              <dd>BO-001 · Bologna</dd>
            </div>
            <div>
              <dt>Certificato</dt>
              <dd>Mock · valido</dd>
            </div>
          </dl>
          <Link to="/app/rentri-connection">
            Gestisci connessione <ArrowRight size={14} />
          </Link>
        </section>
      </div>
      <div className="dashboard-grid lower">
        <section className="panel stock-panel">
          <SectionHeader
            title="Giacenze"
            meta="Aggiornate ora"
            action={
              <Link to="/app/waste-profiles">
                Dettaglio <ArrowRight size={14} />
              </Link>
            }
          />
          <DataTable headers={['Rifiuto', 'Disponibile', 'Ultimo movimento', 'Stato']}>
            {wasteProfiles.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/app/waste-profiles/${item.id}`}>
                    <b className="code">{item.code}</b>
                    <span>{item.name}</span>
                  </Link>
                </td>
                <td className="numeric">
                  <strong>{item.stock}</strong> {item.unit}
                </td>
                <td>{item.lastMovement}</td>
                <td>
                  <Badge tone={item.status === 'Confermato' ? 'success' : 'warning'} dot>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </DataTable>
        </section>
        <section className="panel activity-panel">
          <SectionHeader
            title="Ultime attività"
            action={
              <Link to="/app/audit">
                Registro completo <ArrowRight size={14} />
              </Link>
            }
          />
          <ol>
            {activity.map(([title, entity, time, actor], index) => (
              <li key={title}>
                <span className="timeline-dot">
                  {index === 0 ? (
                    <CheckCircle2 />
                  ) : index === 1 ? (
                    <Cloud />
                  ) : index === 2 ? (
                    <Truck />
                  ) : (
                    <Clock3 />
                  )}
                </span>
                <div>
                  <b>{title}</b>
                  <Link to="#">{entity}</Link>
                  <small>
                    {time} · {actor}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
