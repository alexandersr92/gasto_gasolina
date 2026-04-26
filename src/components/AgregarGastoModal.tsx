import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (monto: number) => void;
}

export default function AgregarGastoModal({ isOpen, onClose, onSave }: Props) {
  const [monto, setMonto] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    const val = parseFloat(monto.replace(",", "."));
    if (!isNaN(val) && val > 0) {
      onSave(val);
      setMonto("");
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nuevo Gasto</h2>
          <button className="modal-close" onClick={onClose}>Cancelar</button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Monto gastado</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ej. 500"
            className="form-input"
            value={monto}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
                setMonto(val);
              }
            }}
            autoFocus
          />
        </div>

        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={!monto || parseFloat(monto.replace(",", ".")) <= 0}
        >
          Guardar Gasto
        </button>
      </div>
    </div>
  );
}
