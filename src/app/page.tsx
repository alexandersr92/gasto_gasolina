"use client";

import { useState } from "react";
import { useGasolinaStore } from "../lib/store";
import AgregarGastoModal from "../components/AgregarGastoModal";
import ConfiguracionModal from "../components/ConfiguracionModal";

export default function Home() {
  const store = useGasolinaStore();
  const [showConfig, setShowConfig] = useState(false);
  const [showAddGasto, setShowAddGasto] = useState(false);

  // Evitar hydration mismatch renderizando hasta que esté cargado del localStorage
  if (!store.isLoaded) {
    return <div style={{ height: "100vh", backgroundColor: "var(--bg-primary)" }} />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Monitoreo Gasolina</h1>
        <button className="btn-icon" onClick={() => setShowConfig(true)}>
          ⚙️
        </button>
      </div>

      <div className="card balance-display">
        <h2 className="text-secondary" style={{ fontSize: 15, margin: 0, textTransform: "uppercase" }}>Saldo Restante</h2>
        <div className={`balance-amount ${store.saldoRestante < 0 ? 'negative' : ''}`}>
          {formatCurrency(store.saldoRestante)}
        </div>
        
        <div style={{ display: "flex", gap: 8, fontSize: 14 }} className="text-secondary">
          <span>Presupuesto:</span>
          <span className="font-bold">{formatCurrency(store.config.presupuestoMensual)}</span>
        </div>
        
        <div style={{ color: "var(--accent)", fontSize: 13, marginTop: 12, fontWeight: 500 }}>
          Faltan {store.diasParaRecarga} días para la recarga
        </div>
      </div>

      <button className="btn-primary" style={{ marginBottom: 30 }} onClick={() => setShowAddGasto(true)}>
        <span style={{ fontSize: 20 }}>+</span> Agregar Gasto
      </button>

      <h2 style={{ fontSize: 17, marginBottom: 12 }}>Gastos de este mes</h2>
      <div className="list-container">
        {store.gastosMesActual.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "var(--text-secondary)" }}>
            No hay gastos registrados en este ciclo.
          </div>
        ) : (
          store.gastosMesActual.map(gasto => (
            <div key={gasto.id} className="list-item">
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Gasolina</div>
                <div className="text-secondary" style={{ fontSize: 13, marginTop: 4 }}>
                  {formatDate(gasto.fecha)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <span style={{ color: "var(--danger)", fontWeight: 600 }}>
                  -{formatCurrency(gasto.monto)}
                </span>
                <button className="item-delete" onClick={() => store.deleteGasto(gasto.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AgregarGastoModal 
        isOpen={showAddGasto} 
        onClose={() => setShowAddGasto(false)}
        onSave={store.addGasto}
      />

      <ConfiguracionModal
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        config={store.config}
        onSave={store.updateConfig}
      />
    </main>
  );
}
