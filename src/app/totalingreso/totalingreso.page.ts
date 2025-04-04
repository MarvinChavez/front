import { Component,OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { Chart } from 'chart.js/auto';

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



  constructor(private ingresoService: IngresoService) {}
  ngOnInit(): void {
    this.obtenerFechaUltima();
  }
  obtenerFechaUltima(): void {
    this.ingresoService.obtenerFecha().subscribe(fecha => {
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

    this.ingresoService.obtenerIngresos(fechaInicioFormatted, fechaFinFormatted, this.servicio).subscribe(data => {
      const fechas = data.ingresos.map((item: any) => {
        const fecha = new Date(item.fecha);
        fecha.setDate(fecha.getDate() + 1); // Sumar un día
        return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      });      
      const montos = data.ingresos.map((item: any) => item.monto);
      const pasajeros = data.ingresos.map((item: any) => item.pasajeros);
      this.montoTotal = data.montoTotal;
        this.totalPasajeros = data.totalPasajeros;
      this.crearGrafico(fechas, montos, pasajeros);
      if(this.contador==1){
        this.mostrarFiltros = true;
      }else{
        this.mostrarFiltros = false;
      }
      this.contador=0;
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
  
  crearGrafico(fechas: string[], montos: number[], pasajeros: number[]): void {
    const canvas = document.getElementById('graficoCanvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  if (this.chart) {
    this.chart.destroy();
  }

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
          pointRadius: 2.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false // 🔥 Desactiva etiquetas en los puntos del gráfico
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(context.parsed.y);
                }
                const index = context.dataIndex;
                const pasajerosCount = pasajeros[index]; 
                label += ` | Pasajeros: ${pasajerosCount}`;
                return label;
              },
              title: function(context) {
                if (!context || !context.length || !context[0].chart) {
                  return ''; // Retorna una cadena vacía si no hay datos disponibles
                }
              
                const index = context[0].dataIndex;
                const labels = context[0].chart.data.labels; 
              
                if (!labels || !labels[index]) {
                  return 'Fecha no disponible'; // Evita errores si la fecha no está presente
                }
              
                const fechaStr = String(labels[index]); // Convertir a string explícitamente
                const fecha = new Date(fechaStr); // Crear objeto Date
              
                if (isNaN(fecha.getTime())) { 
                  return 'Fecha inválida'; // Manejo de error si la conversión falla
                }
              
                return fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });
              }
              
            }
          }
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Fecha',
              color: '#333',
              font: { size: 16 }
            },
            grid: { display: false },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 7,
              maxRotation: 0,
              minRotation: 0
            }
          },
          y: {
            title: {
              display: true,
              text: 'Monto (S/.)',
              color: '#333',
              font: { size: 16 }
            },
            grid: { color: 'rgba(200, 200, 200, 0.1)' }
          }
        }
      }
    });
  }
}
