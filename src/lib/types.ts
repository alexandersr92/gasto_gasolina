export interface Gasto {
  id: number;
  monto: number;
  fecha: string; // ISO String for easy storage
}

export interface Configuracion {
  presupuestoMensual: number;
  diaRecarga: number;
}
