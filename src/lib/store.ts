import { useState, useEffect } from "react";
import { Gasto, Configuracion } from "./types";

const CONFIG_KEY = "gasolina_config";
const GASTOS_KEY = "gasolina_gastos";

export function useGasolinaStore() {
  const [config, setConfig] = useState<Configuracion>({
    presupuestoMensual: 0,
    diaRecarga: 1,
  });
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    const savedGastos = localStorage.getItem(GASTOS_KEY);
    if (savedGastos) {
      setGastos(JSON.parse(savedGastos));
    }
    setIsLoaded(true);
  }, []);

  // Save Config
  const updateConfig = (monto: number, diaRecarga: number) => {
    const newConfig = { presupuestoMensual: monto, diaRecarga };
    setConfig(newConfig);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
  };

  // Add Expense
  const addGasto = (monto: number) => {
    const newGasto: Gasto = {
      id: Date.now(),
      monto,
      fecha: new Date().toISOString(),
    };
    const newGastos = [newGasto, ...gastos];
    setGastos(newGastos);
    localStorage.setItem(GASTOS_KEY, JSON.stringify(newGastos));
  };

  // Delete Expense
  const deleteGasto = (id: number) => {
    const newGastos = gastos.filter((g) => g.id !== id);
    setGastos(newGastos);
    localStorage.setItem(GASTOS_KEY, JSON.stringify(newGastos));
  };

  // Helpers de Fecha (Replicados de iOS)
  const getFechaInicioCiclo = (fecha: Date, diaRecarga: number) => {
    const start = new Date(fecha);
    const currentDay = start.getDate();
    if (currentDay < diaRecarga) {
      start.setMonth(start.getMonth() - 1);
    }
    start.setDate(Math.min(diaRecarga, getLastDayOfMonth(start.getFullYear(), start.getMonth())));
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getFechaFinCiclo = (fecha: Date, diaRecarga: number) => {
    const start = getFechaInicioCiclo(fecha, diaRecarga);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    return end;
  };

  const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Calculos
  const today = new Date();
  const inicioCiclo = getFechaInicioCiclo(today, config.diaRecarga);
  const finCiclo = getFechaFinCiclo(today, config.diaRecarga);

  // Filtrar gastos del mes actual
  const gastosMesActual = gastos.filter((g) => {
    const date = new Date(g.fecha);
    return date >= inicioCiclo && date < finCiclo;
  });

  const totalGastadoMes = gastosMesActual.reduce((acc, g) => acc + g.monto, 0);
  const saldoRestante = config.presupuestoMensual - totalGastadoMes;

  // Días para recarga
  const msPerDay = 1000 * 60 * 60 * 24;
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const diasParaRecarga = Math.round((finCiclo.getTime() - todayStart.getTime()) / msPerDay);

  return {
    config,
    gastosMesActual,
    totalGastadoMes,
    saldoRestante,
    diasParaRecarga,
    isLoaded,
    updateConfig,
    addGasto,
    deleteGasto,
  };
}
