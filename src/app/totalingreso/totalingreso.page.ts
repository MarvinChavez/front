import { Component,OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart,
  ChartDataset
} from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-totalingreso',
  standalone:false,
  templateUrl: './totalingreso.page.html',
  styleUrls: ['./totalingreso.page.scss'],
})
export class TotalingresoPage {
  chart: any;
  fecha_inicio: string = '';
  fecha_fin: string = '';
  servicio: string = '';

  ingresos: any[] = [];
  montoTotal: number = 0;
  totalPasajeros: number = 0;
  mostrarFiltros: boolean = true; 
  contador:number=1;
  fechadevuelta: Date = new Date();
  empresa_id: number = 0;



  constructor(private ingresoService: IngresoService) {}
  ngOnInit(): void {
    const storedId = localStorage.getItem('empresa_id');
      if (storedId) {
        this.empresa_id = parseInt(storedId, 10);
      }
    this.lockOrientation();
    this.obtenerFechaUltima();
  }
  obtenerFechaUltima(): void {
    this.ingresoService.obtenerFecha(this.empresa_id).subscribe(fecha => {
        this.fechadevuelta = new Date(fecha);
        this.setPeriodo('semana');
    });
}
  obtenerDatos(): void {
    if (!this.fecha_inicio || !this.fecha_fin) {
      alert('Por favor selecciona un rango de fechas.');
      return;
    }
    const fechaInicioFormatted = this.fecha_inicio.split('T')[0];
  const fechaFinFormatted = this.fecha_fin.split('T')[0];

    this.ingresoService.obtenerIngresos(fechaInicioFormatted, fechaFinFormatted, this.servicio,this.empresa_id).subscribe(data => {
      const fechas = data.ingresos.map((item: any) => {
        const fecha = new Date(item.fecha);
        fecha.setDate(fecha.getDate()); // Sumar un día
        return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      });      
      const montos = data.ingresos.map((item: any) => item.monto);
      const pasajeros = data.ingresos.map((item: any) => item.pasajeros);
      this.montoTotal = data.montoTotal;
        this.totalPasajeros = data.totalPasajeros;
       let fechasOrdenadas = [...fechas].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    let fechaMin = fechasOrdenadas[0];
    let fechaMax = fechasOrdenadas[fechasOrdenadas.length - 1];
    let fechaMinDate = new Date(fechaMin);
    let fechaMaxDate = new Date(fechaMax);
      fechaMinDate.setDate(fechaMinDate.getDate() + 1);
      fechaMaxDate.setDate(fechaMaxDate.getDate() + 1);
      fechaMin = fechaMinDate.toISOString();
      fechaMax = fechaMaxDate.toISOString();
          let montoMin = Math.min(...montos);
          let montoMax = Math.max(...montos);
      console.log('Fechas ordenadas:', fechasOrdenadas);
      console.log('fechaMin:', fechaMin, 'fechaMax:', fechaMax);
if(this.contador==1){
        this.mostrarFiltros = true;
      }else{
        this.mostrarFiltros = false;
      }
      this.contador=0;
    this.crearGrafico(fechas, montos, pasajeros, fechaMin, fechaMax, montoMin, montoMax);
      
    });
  }
  limpiarFiltros(): void {
    this.mostrarFiltros = true; 
    this.montoTotal = 0;
    this.totalPasajeros = 0;
    if (this.chart) {
      this.chart.destroy();
    }
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
    this.obtenerDatos();
  }
  
  crearGrafico(fechas: string[], montos: number[], pasajeros: number[], fechaMin: string, fechaMax: string, montoMin: number, montoMax: number): void {
  const canvas = document.getElementById('graficoCanvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (this.chart) {
    this.chart.destroy();
  }

  Chart.register(zoomPlugin);

   this.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Ingresos Totales',
        data: montos,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 2.5,
        // @ts-ignore: propiedad personalizada para tooltip
        pasajerosData: pasajeros
} as ChartDataset<'line', number[]> & { pasajerosData?: number[] }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#333',
            font: { size: 14 }
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const monto = context.parsed.y ?? 0;
              const pasajeros = (context.dataset as any).pasajerosData?.[context.dataIndex] ?? 0;
              const montoFormateado = new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN'
              }).format(monto);
              return `${montoFormateado} - Pasajeros: ${pasajeros}`;
            },
            title: function (context) {
              return new Date(context[0].parsed.x).toLocaleDateString('es-PE', {
                day: 'numeric',
                month: 'long'
              });
            }
          }
        },
        datalabels: {
          display: false
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x'
          },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
            drag: { enabled: true }
          },
          limits: {
            x: {
              min: new Date(fechaMin).getTime(), // ✅ timestamp requerido
              max: new Date(fechaMax).getTime()
            },
            y: {
              min: montoMin - 1000,
              max: montoMax + 1000
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day' },
          min: fechaMin,
          max: fechaMax,
          grid: { display: false },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            maxRotation: 0,
            minRotation: 0
          }
        },
        y: {
          min: montoMin - 1000,
          max: montoMax + 1000,
          grid: { color: 'rgba(200, 200, 200, 0.1)' }
        }
      }
    }
  });
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
