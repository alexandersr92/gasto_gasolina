import { useState, useEffect } from "react";
import { Configuracion } from "../lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: Configuracion;
  onSave: (monto: number, dia: number) => void;
}

export default function ConfiguracionModal({ isOpen, onClose, config, onSave }: Props) {
  const [monto, setMonto] = useState("");
  const [diaRecarga, setDiaRecarga] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setMonto(config.presupuestoMensual > 0 ? config.presupuestoMensual.toString() : "");
      setDiaRecarga(config.diaRecarga);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSave = () => {
    const val = parseFloat(monto.replace(",", "."));
    if (!isNaN(val)) {
      onSave(val, diaRecarga);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Configuración</h2>
          <button className="modal-close" onClick={onClose}>Cancelar</button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Presupuesto Mensual</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Monto X (Ej. 1000)"
            className="form-input"
            value={monto}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
                setMonto(val);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Día de recarga</label>
          <p className="text-secondary" style={{fontSize: 13, marginBottom: 8}}>
            Día del mes en que se renueva tu presupuesto.
          </p>
          <select 
            className="form-select" 
            value={diaRecarga}
            onChange={(e) => setDiaRecarga(parseInt(e.target.value))}
          >
            {Array.from({length: 31}, (_, i) => i + 1).map(dia => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={!monto || parseFloat(monto.replace(",", ".")) < 0}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
