import { Component, OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';

interface Ciudad {
  nombre: string;
  fechas: string[];
  montos: number[];
  pasajeros: number[];
  total: number;
  total_pasajeros: number;
}
interface Ruta {
  id: number;
  ciudad_inicial: string;
  ciudad_final: string;
}
interface Ciudadm {
  ciudad_inicial: string;
  monto_promedio?: number;
  ultimo_registro?: { fecha: string; monto: number };
}
@Component({
  selector: 'app-ruta-ingreso',
  standalone: false,
  templateUrl: './ruta-ingreso.page.html',
  styleUrls: ['./ruta-ingreso.page.scss'],
})

export class RutaIngresoPage implements OnInit {

  chart: any;
    fecha_inicio: string = '';
    fecha_fin: string = '';
    servicio: string = '';
    rutas: number[] = [];
    montoTotal: number = 0;
    totalPasajeros: number = 0;
    rutasDisponibles: Ruta[] = [];
    fechadevuelta: Date = new Date();
    rutasm: Ciudadm[] = [];
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
      this.ingresoService.obtenerRutas(this.empresa_id).subscribe((data: Ruta[]) => {  // ⬅️ Cambiar `string[]` por `Ruta[]`
        this.rutasDisponibles = data;
      }, error => {
        console.error('Error al obtener rutas:', error);
      });
    }
    
    limpiarFiltros(): void {
      this.mostrarFiltros = true; 
      this.montoTotal = 0;
      this.totalPasajeros = 0;
      this.datosMostrados = [];
      if (this.chart) {
        this.chart.destroy();
      }
    }
    obtenerYCrearGrafico() {
      if (!this.fecha_inicio || !this.fecha_fin) {
        alert('Por favor selecciona un rango de fechas.');
        return;
      }
      if(this.contador==1){
        this.mostrarFiltros = true;
      }else{
        this.mostrarFiltros = false;
      }
      this.contador=0;
      
      const fechaInicioFormatted = this.fecha_inicio.split('T')[0];
      const fechaFinFormatted = this.fecha_fin.split('T')[0];
  
      this.ingresoService.obtenerIngresosTRuta(fechaInicioFormatted, fechaFinFormatted, this.servicio, this.rutas,this.empresa_id).subscribe(data => {
        this.rutasm = data.rutas;
        let todasLasFechas: string[] = [];
        this.montoTotal=data.total_general;
        this.totalPasajeros=data.total_pasajeros;
        data.rutas.forEach((ciudad: Ciudad) => {
          todasLasFechas = [...todasLasFechas, ...ciudad.fechas];
        });
        todasLasFechas = [...new Set(todasLasFechas)].sort();
  
        const canvas = document.getElementById('graficoRuta') as HTMLCanvasElement;
        if (!canvas) return;
  
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
  
        // Destruir el gráfico si ya existe
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;  // Limpiar la referencia
        }
        const datasets = data.rutas.map((ciudad: Ciudad, index: number) => {
          const montos = todasLasFechas.map(fecha => {
            const indexFecha = ciudad.fechas.indexOf(fecha);
            return indexFecha >= 0 ? ciudad.montos[indexFecha] : NaN;
          });
  
          const pasajerosData = todasLasFechas.map(fecha => {
            const indexFecha = ciudad.fechas.indexOf(fecha);
            return indexFecha >= 0 ? ciudad.pasajeros[indexFecha] : 0;
          });
  
          return {
            label: `${ciudad.nombre} (Total:S/.${ciudad.total.toLocaleString('es-PE')}- P=${ciudad.total_pasajeros})`,
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
                  font: { size: 14 }
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
                display: false // <-- Esto asegura que no se muestren labels sobre los puntos
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
        
      }, error => {
        console.error('Error al obtener los datos:', error);
      });
    }
  
    mostrarMontosPromedio() {
      if (!Array.isArray(this.rutasm)) {
        console.error('Error: rutasm no es un array', this.rutasm);
        return;
      }
    
      this.datosMostrados = this.rutasm.map(ciudadm => ({
        monto_promedio: ciudadm.monto_promedio ? ciudadm.monto_promedio.toLocaleString('es-PE') : 'N/A',
      }));
    }
  
    mostrarMontos() {
      this.datosMostrados = this.rutasm.map(ciudadm => ({
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
