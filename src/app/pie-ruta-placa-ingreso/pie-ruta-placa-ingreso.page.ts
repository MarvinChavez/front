import { Component, OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns';import { ChangeDetectorRef } from '@angular/core';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';
import zoomPlugin from 'chartjs-plugin-zoom';

interface Auto {
  id: number;
  placa: string;
}

interface IngresoData {
  labels: string[];
  data: number[];
  numeroTurnos: number[];
  pasajerosPorRuta: number[];
  total: number;
  total_pasajeros_general: number;
  
}

@Component({
  selector: 'app-pie-ruta-placa-ingreso',
  standalone: false,
  templateUrl: './pie-ruta-placa-ingreso.page.html',
  styleUrls: ['./pie-ruta-placa-ingreso.page.scss'],
})
export class PieRutaPlacaIngresoPage implements OnInit {
  chart:any;
  fecha_inicio: string = '';
  fecha_fin: string = '';
  servicio: string = '';
  autoId: number = 0;
  autosDisponibles: Auto[] = [];
  montoTotal: number = 0;
  totalPasajeros: number = 0;
  contador:number=1;
  mostrarFiltros: boolean = true; 
  fechadevuelta: Date = new Date();
  empresa_id: number = 0;
leyendaPersonalizada: { label:string, color: string, turnos: string, monto: string, pasajeros: string }[] = [];

  constructor(private ingresoService: IngresoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('empresa_id');
    if (storedId) {
      this.empresa_id = parseInt(storedId, 10);
    }
    this.lockOrientation();
    this.obtenerCiudades();
    this.obtenerFechaUltima();
  }
  obtenerFechaUltima(): void {
    this.ingresoService.obtenerFecha(this.empresa_id).subscribe(fecha => {
        this.fechadevuelta = new Date(fecha);
        this.setPeriodo('semana');
    });
}
 
  obtenerCiudades(): void {
    this.ingresoService.obtenerAutos(this.empresa_id).subscribe(
      (data: Auto[]) => {
        this.autosDisponibles = data;
      },
      (error) => {
        console.error('Error al obtener autos:', error);
      }
    );
  }

 obtenerYCrearGrafico(): void {
  if (!this.fecha_inicio || !this.fecha_fin) {
    alert('Por favor selecciona un rango de fechas.');
    return;
  }

  this.mostrarFiltros = this.contador === 1;
  this.contador = 0;

  const fechaInicioFormatted = this.fecha_inicio.split('T')[0];
  const fechaFinFormatted = this.fecha_fin.split('T')[0];

  this.ingresoService.obtenerIngresosPRutaPlaca(
    this.autoId,
    fechaInicioFormatted,
    fechaFinFormatted,
    this.servicio,
    this.empresa_id
  ).subscribe(
    (data: IngresoData) => {
      const colores = [
        '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
        '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395'
      ];

      const labels = data.labels;
      const montos = data.data;
      const pasajeros = data.pasajerosPorRuta;
      const total = data.total;
      const porcentajes = data.data.map(monto => (total > 0 ? (monto / total) * 100 : 0));
      this.leyendaPersonalizada = [];

      const backgroundColors = labels.map((_, index) => colores[index % colores.length]);

      labels.forEach((label, index) => {
  this.leyendaPersonalizada.push({
    color: backgroundColors[index],
    label: label, // 👈 agrega esto
    turnos: `Turnos: ${data.numeroTurnos[index]}`,
    monto: `S/. ${montos[index].toFixed(2)}`,
    pasajeros: `P: ${pasajeros[index]}`
  });
  this.montoTotal=data.total;
  this.totalPasajeros=data.total_pasajeros_general;
});


      const canvas = document.getElementById('graficoPieRPlaca') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (this.chart) {
        this.chart.destroy();
      }

      Chart.register(zoomPlugin, ChartDataLabels);

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Monto por ruta',
            data: montos,
            backgroundColor: backgroundColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const index = context.dataIndex;
                  const monto = montos[index].toLocaleString('en-US');
                  const pas = pasajeros[index];
                  const porcentaje = porcentajes ? Math.round(porcentajes[index]) : 0;
                  return `S/. ${monto} - ${pas} pasajeros (${porcentaje}%)`;
                }
              }
            },
            datalabels: {
              formatter: (value, context) => {
                const index = context.dataIndex;
                const porcentaje = porcentajes ? Math.round(porcentajes[index]) : 0;
                return `S/. ${value.toLocaleString('en-US')}\n(${porcentaje}%)`;
              },
              color: '#fff',
              font: {
                weight: 'bold'
              }
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'xy'
              },
              zoom: {
                wheel: {
                  enabled: true
                },
                pinch: {
                  enabled: true
                },
                mode: 'xy'
              }
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    },
    (error) => {
      console.error('Error al obtener datos:', error);
    }
  );
}
  setPeriodo(tipo: string): void {
    const hoy = new Date(this.fechadevuelta);
    const inicio = new Date(hoy);
  
    switch (tipo) {
      case 'semana':
        inicio.setDate(hoy.getDate() - 7);
        break;
      case 'mes':
        inicio.setMonth(hoy.getMonth() - 1);
        break;
      case 'anio':
        inicio.setFullYear(hoy.getFullYear() - 1);
        break;
    }
    this.fecha_fin=this.fechadevuelta.toISOString().split('T')[0]
    this.fecha_inicio = inicio.toISOString().split('T')[0]; 
    this.obtenerYCrearGrafico();
  }
  limpiarFiltros(): void {
    this.mostrarFiltros = true; 
    this.montoTotal = 0;
    this.totalPasajeros = 0;
   
  }
  async lockOrientation() {
    try {
    await ScreenOrientation.lock({ orientation: 'landscape' });
      console.log('Orientación bloqueada en horizontal');
    } catch (error) {
      console.error('Error bloqueando orientación:', error);
    }
  }
  
  
}