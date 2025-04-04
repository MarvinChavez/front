import { Component, OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dia-ingreso',
  standalone:false,
  templateUrl: './dia-ingreso.page.html',
  styleUrls: ['./dia-ingreso.page.scss'],
})
export class DiaIngresoPage implements OnInit {

  chart: any;
  fecha_inicio: string = '';
  servicio: string = '';

  ingresos: any[] = [];
  montoTotal: number = 0;
  totalPasajeros: number = 0;
  fechadevuelta: Date = new Date();

  constructor(private ingresoService: IngresoService) {}
  
  ngOnInit(): void {
    this.obtenerFechaUltima(); 
  }
  obtenerFechaUltima(): void {
    this.ingresoService.obtenerFecha().subscribe(fecha => {
        this.fechadevuelta = new Date(fecha);
        this.fecha_inicio = this.fechadevuelta.toISOString().split('T')[0]; 
        this.setPeriodo('ruta');
    });
}
  obtenerDatosRuta(): void {
    if (!this.fecha_inicio) {
      alert('Por favor selecciona una fecha.');
      return;
    }
    const fechaInicioFormatted = this.fecha_inicio.split('T')[0];
    this.ingresoService.obtenerIngresosRuta(fechaInicioFormatted, this.servicio).subscribe(data => {
      const rutas = data.labels;
      const montos = data.montos;
      const pasajeros = data.pasajeros;
      this.montoTotal = data.montoTotal;
      this.totalPasajeros = data.totalPasajeros;
      this.crearGrafico(rutas, montos, pasajeros);
    });
  }
  obtenerDatosOficina(): void {
    if (!this.fecha_inicio) {
      alert('Por favor selecciona una fecha.');
      return;
    }
    const fechaInicioFormatted = this.fecha_inicio.split('T')[0];
    this.ingresoService.obtenerIngresosOficina(fechaInicioFormatted, this.servicio).subscribe(data => {
      const rutas = data.labels;
      const montos = data.montos;
      const pasajeros = data.pasajeros;
      this.montoTotal = data.montoTotal;
      this.totalPasajeros = data.totalPasajeros;
      this.crearGrafico(rutas, montos, pasajeros);
    });
  }
  obtenerDatosTurno(): void {
    if (!this.fecha_inicio) {
      alert('Por favor selecciona una fecha.');
      return;
    }
    const fechaInicioFormatted = this.fecha_inicio.split('T')[0];
    this.ingresoService.obtenerIngresosTurno(fechaInicioFormatted, this.servicio).subscribe(data => {
      const rutas = data.labels;
      const montos = data.montos;
      const pasajeros = data.pasajeros;
      this.montoTotal = data.montoTotal;
      this.totalPasajeros = data.totalPasajeros;
      this.crearGrafico(rutas, montos, pasajeros);
    });
  }
  setPeriodo(tipo: string): void {
    switch (tipo) {
      case 'ruta':
        this.obtenerDatosRuta();
        break;
      case 'oficina':
        this.obtenerDatosOficina();      
        break;
      case 'turno':
        this.obtenerDatosTurno();
        break;
    }
  }
  crearGrafico(rutas: string[], montos: number[], pasajeros: number[]): void {
    const canvas = document.getElementById('graficoIngresos') as HTMLCanvasElement;
    if (!canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (this.chart) {
      this.chart.destroy();
    }
    Chart.register(ChartDataLabels);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: rutas,
        datasets: [{
          data: montos,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (tooltipItem) => {
                let monto = montos[tooltipItem.dataIndex];
                let pasajero = pasajeros[tooltipItem.dataIndex];

                return [`Monto: S/ ${monto.toLocaleString('es-PE')}`, `Pasajeros: ${pasajero}`];
              }
            }
          },
          legend: {
            display: false
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            formatter: (value, context) => {
              let pasajero = pasajeros[context.dataIndex];
              return `S/ ${value.toLocaleString('es-PE')} - P=${pasajero}`;
            },
            font: {
              weight: 'bold',
              size: 12
            },
            color: '#333'
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            suggestedMax: Math.ceil(Math.max(...montos) / 8000) * 8000,
            grid: { display: false },
            ticks: { stepSize: 5000 }
          },
          y: {
            grid: { display: false },
            ticks: { autoSkip: false, maxRotation: 0, minRotation: 0, padding: 10 }
          }
        }
      }
    });
  }
}
