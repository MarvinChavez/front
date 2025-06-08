import { Component, OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';
import zoomPlugin from 'chartjs-plugin-zoom';

interface Ciudad {
  ciudad_inicial: string;
  fechas: string[];
  montos: number[];
  pasajeros: number[];
  montoTotal: number;
  total_pasajeros: number;
}
interface Ciudadm {
  ciudad_inicial: string;
  promedio?: number;
  ultimo_registro?: { fecha: string; monto: number };
}
@Component({
  selector: 'app-oficina-ingreso',
  standalone: false,
  templateUrl: './oficina-ingreso.page.html',
  styleUrls: ['./oficina-ingreso.page.scss'],
})
export class OficinaIngresoPage implements OnInit {
  chart: any;
  fecha_inicio: string = '';
  fecha_fin: string = '';
  servicio: string = '';
  ciudades: string[] = [];
  montoTotal: number = 0;
  totalPasajeros: number = 0;
  ciudadesDisponibles: string[] = [];
  fechadevuelta: Date = new Date();
  ciudadesm: Ciudadm[] = [];
  datosMostrados: any[] = []; 
  contador:number=1;
  mostrarFiltros: boolean = true; 
  empresa_id: number = 0;

  constructor(private ingresoService: IngresoService) {}
  
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
    this.ingresoService.obtenerCiudades(this.empresa_id).subscribe((data: string[]) => {
      this.ciudadesDisponibles = data;
    }, error => {
      console.error('Error al obtener ciudades:', error);
    });
  }

  obtenerYCrearGrafico() {
    if (!this.fecha_inicio || !this.fecha_fin) {
      alert('Por favor selecciona un rango de fechas.');
      return;
    }
    
    const fechaInicioFormatted = this.fecha_inicio.split('T')[0];
    const fechaFinFormatted = this.fecha_fin.split('T')[0];

    this.ingresoService.obtenerIngresosTOficina(fechaInicioFormatted, fechaFinFormatted, this.servicio, this.ciudades,this.empresa_id).subscribe(data => {
      this.ciudadesm = data.ciudades;
      let todasLasFechas: string[] = [];
      this.montoTotal=data.total_general;
      this.totalPasajeros=data.total_pasajeros;
      data.ciudades.forEach((ciudad: Ciudad) => {
        todasLasFechas = [...todasLasFechas, ...ciudad.fechas];
      });
      todasLasFechas = [...new Set(todasLasFechas)].sort();

      const canvas = document.getElementById('graficoIngreso') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Destruir el gráfico si ya existe
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;  // Limpiar la referencia
      }
      const datasets = data.ciudades.map((ciudad: Ciudad, index: number) => {
        const montos = todasLasFechas.map(fecha => {
          const indexFecha = ciudad.fechas.indexOf(fecha);
          return indexFecha >= 0 ? ciudad.montos[indexFecha] : NaN;
        });

        const pasajerosData = todasLasFechas.map(fecha => {
          const indexFecha = ciudad.fechas.indexOf(fecha);
          return indexFecha >= 0 ? ciudad.pasajeros[indexFecha] : 0;
        });

        return {
          label: `${ciudad.ciudad_inicial} (S/. ${ciudad.montoTotal.toLocaleString('es-PE')}- P=${ciudad.total_pasajeros})`,
          data: montos,
          borderColor: this.getRandomColor(index),
          backgroundColor: this.getRandomColor(index),
          tension: 0.3,
          pointRadius: 2.5,
          pointHoverRadius: 6,
          fill: false,
          spanGaps: true,
          pasajerosData: pasajerosData as any
        };
      });
      Chart.register(zoomPlugin);

      this.chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: todasLasFechas,
    datasets: datasets
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
          font: { size: 10 }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            let label = 'Monto';
            if (context.parsed.y !== null) {
              label += ': ' + new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN'
              }).format(context.parsed.y);
            }
            const pasajeros = (context.dataset as any).pasajerosData?.[context.dataIndex] ?? 0;
            return `${label} - Pasajeros: ${pasajeros}`;
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
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
          drag: {
            enabled: true
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        grid: { display: false },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7,
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        grid: { color: 'rgba(200, 200, 200, 0.1)' }
      }
    }
  }
});

      if(this.contador==1){
        this.mostrarFiltros = true;
      }else{
        this.mostrarFiltros = false;
      }
      this.contador=0;
    }, error => {
      console.error('Error al obtener los datos:', error);
    });
  }

  mostrarMontosPromedio() {
    if (!Array.isArray(this.ciudadesm)) {
      console.error('Error: ciudadesm no es un array', this.ciudadesm);
      return;
    }
  
    this.datosMostrados = this.ciudadesm.map(ciudadm => ({
      promedio: ciudadm.promedio ? ciudadm.promedio.toLocaleString('es-PE') : 'N/A',
    }));
  }
  limpiarFiltros(): void {
    this.mostrarFiltros = true; 
    this.montoTotal = 0;
    this.totalPasajeros = 0;
    this.datosMostrados = []; // Vaciar la lista de tarjetas
    if (this.chart) {
      this.chart.destroy();
    }
  }
  

  mostrarMontos() {
    this.datosMostrados = this.ciudadesm.map(ciudadm => ({
      fecha: ciudadm.ultimo_registro?.fecha || 'N/A',
      monto: ciudadm.ultimo_registro?.monto ? ciudadm.ultimo_registro.monto.toLocaleString('es-PE') : 'N/A',
    }));
  }
  getRandomColor(index: number, alpha: number = 1): string {
    const colors = [
      'rgba(255, 99, 132, ALPHA)',
      'rgba(54, 162, 235, ALPHA)',
      'rgba(255, 206, 86, ALPHA)',
      'rgba(75, 192, 192, ALPHA)',
      'rgba(153, 102, 255, ALPHA)',
      'rgba(255, 159, 64, ALPHA)'
    ];
    return colors[index % colors.length].replace('ALPHA', alpha.toString());
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
  async lockOrientation() {
    try {
    await ScreenOrientation.lock({ orientation: 'landscape' });
      console.log('Orientación bloqueada en horizontal');
    } catch (error) {
      console.error('Error bloqueando orientación:', error);
    }
  }
}