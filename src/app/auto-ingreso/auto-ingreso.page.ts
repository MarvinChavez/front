import { Component, OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';
import zoomPlugin from 'chartjs-plugin-zoom';

interface Ciudad {
  nombre: string;
  fechas: string[];
  montos: number[];
  turnos: number[];
  pasajeros: number[];
  total: number;
  total_pasajeros: number;
}
interface Auto {
  id: number;
  placa: string;
}
interface Ciudadm {
  placa: string;
  monto_promedio?: number;
  ultimo_registro?: { fecha: string; monto: number };
}
@Component({
  selector: 'app-auto-ingreso',
  standalone: false,
  templateUrl: './auto-ingreso.page.html',
  styleUrls: ['./auto-ingreso.page.scss'],
})
export class AutoIngresoPage implements OnInit {

  chart: any;
      fecha_inicio: string = '';
      fecha_fin: string = '';
      servicio: string = '';
      autos: number[] = [];
      montoTotal: number = 0;
      totalPasajeros: number = 0;
      autosDisponibles: Auto[] = [];
      fechadevuelta: Date = new Date();
      autosm: Ciudadm[] = [];
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
        this.ingresoService.obtenerAutos(this.empresa_id).subscribe((data: Auto[]) => {  // ⬅️ Cambiar `string[]` por `Ruta[]`
          this.autosDisponibles = data;
        }, error => {
          console.error('Error al obtener autos:', error);
        });
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
    
        this.ingresoService.obtenerIngresosTAuto(fechaInicioFormatted, fechaFinFormatted, this.servicio, this.autos,this.empresa_id).subscribe(data => {
          this.autosm = data.autos;
          let todasLasFechas: string[] = [];
          this.montoTotal=data.total_general;
          this.totalPasajeros=data.total_pasajeros;
          data.autos.forEach((ciudad: Ciudad) => {
            todasLasFechas = [...todasLasFechas, ...ciudad.fechas];
          });
          todasLasFechas = [...new Set(todasLasFechas)].sort();
    
          const canvas = document.getElementById('graficoAuto') as HTMLCanvasElement;
          if (!canvas) return;
    
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
    
          let fechasOrdenadas = [...todasLasFechas].sort();
          let fechaMin = new Date(fechasOrdenadas[0]);
          let fechaMax = new Date(fechasOrdenadas[fechasOrdenadas.length - 1]);
          fechaMax.setDate(fechaMax.getDate() + 1);
          let todosLosMontos = data.autos.flatMap((ciudad: Ciudad) => ciudad.montos);
          let montoMin = Math.min(...todosLosMontos.filter((m: number) => !isNaN(m)));
          let montoMax = Math.max(...todosLosMontos.filter((m: number) => !isNaN(m)));
          if (this.chart) {
            this.chart.destroy();
            this.chart = null;  
          }
          const datasets = data.autos.map((ciudad: Ciudad, index: number) => {
            const montos = todasLasFechas.map(fecha => {
              const indexFecha = ciudad.fechas.indexOf(fecha);
              return indexFecha >= 0 ? ciudad.montos[indexFecha] : NaN;
            });
    
            const pasajerosData = todasLasFechas.map(fecha => {
              const indexFecha = ciudad.fechas.indexOf(fecha);
              return indexFecha >= 0 ? ciudad.pasajeros[indexFecha] : 0;
            });
    
            return {
              label: `${ciudad.nombre} (Total: S/. ${ciudad.total.toLocaleString('es-PE')} - P=${ciudad.total_pasajeros})`,
              data: montos,
              borderColor: this.getRandomColor(index),
              backgroundColor: this.getRandomColor(index),
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 8,
              pointHitRadius: 15,
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
                  },
                  limits: {
                  x: {
                    min: fechaMin.getTime(),
                    max: fechaMax.getTime()
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
                  min: fechaMin.getTime(), // ✅ convierte a number
                max: fechaMax.getTime(),
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
                  min: 0,
                  max: montoMax + 1000,
                  grid: { color: 'rgba(200, 200, 200, 0.1)' }
                }
              }
            }
            
          });
        }, error => {
          console.error('Error al obtener los datos:', error);
        });
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
      mostrarMontosPromedio() {
        if (!Array.isArray(this.autosm)) {
          console.error('Error: autosm no es un array', this.autosm);
          return;
        }
      
        this.datosMostrados = this.autosm.map(ciudadm => ({
          monto_promedio: ciudadm.monto_promedio ? ciudadm.monto_promedio.toLocaleString('es-PE') : 'N/A',
        }));
      }
    
      mostrarMontos() {
        this.datosMostrados = this.autosm.map(ciudadm => ({
          fecha: ciudadm.ultimo_registro?.fecha || 'N/A',
          monto: ciudadm.ultimo_registro?.monto ? ciudadm.ultimo_registro.monto.toLocaleString('es-PE') : 'N/A',
        }));
      }
      getRandomColor(index: number, alpha: number = 1): string {
        const colors = [
          '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
        '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395'
        ];
        return colors[index % colors.length];
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
