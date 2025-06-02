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
  pasajeros: number[];
  total: number;
  total_pasajeros: number;
}
interface Ruta {
  id: number;
  ciudad_inicial: string;
  ciudad_final: string;
}
interface Turno {
  id: number;
  hora: string;
}
interface Ciudadm {
  ciudad_inicial: string;
  monto_promedio?: number;
  ultimo_registro?: { fecha: string; monto: number };
}
@Component({
  selector: 'app-turno-ingreso',
  standalone: false,
  templateUrl: './turno-ingreso.page.html',
  styleUrls: ['./turno-ingreso.page.scss'],
})
export class TurnoIngresoPage implements OnInit {

  chart: any;
  idRuta:number=0;
      fecha_inicio: string = '';
      fecha_fin: string = '';
      servicio: string = '';
      turnos: number[] = [];
      montoTotal: number = 0;
      fechadevuelta: Date = new Date();

      totalPasajeros: number = 0;
      turnosDisponibles: Turno[] = [];
      rutasDisponibles: Ruta[] = [];
      turnosm: Ciudadm[] = [];
      datosMostrados: any[] = []; 
      contador:number=1;
      mostrarFiltros: boolean = true; 
      empresa_id: number = 0;
        textoRutaSeleccionada: string = '';

      constructor(private ingresoService: IngresoService) {}
      
      ngOnInit(): void {
        const storedId = localStorage.getItem('empresa_id');
      if (storedId) {
        this.empresa_id = parseInt(storedId, 10);
      }
        this.lockOrientation();
        this.obtenerCiudades();
        this.obtenerRutas();
        this.obtenerFechaUltima();
      }
      obtenerFechaUltima(): void {
        this.ingresoService.obtenerFecha(this.empresa_id).subscribe(fecha => {
            this.fechadevuelta = new Date(fecha); 
            this.setPeriodo('semana'); 
        });
    }
    
      obtenerRutas(): void {
        this.ingresoService.obtenerRutas(this.empresa_id).subscribe((data: Ruta[]) => {  // ⬅️ Cambiar `string[]` por `Turno[]`
          this.rutasDisponibles = data;
        }, error => {
          console.error('Error al obtener rutas:', error);
        });
      }
      obtenerCiudades(): void {
        this.ingresoService.obtenerTurnos(this.idRuta,this.servicio).subscribe((data: Turno[]) => {  // ⬅️ Cambiar `string[]` por `Turno[]`
          this.turnosDisponibles = data;
        }, error => {
          console.error('Error al obtener turnos:', error);
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
    
        this.ingresoService.obtenerIngresosTTurno(this.idRuta,fechaInicioFormatted, fechaFinFormatted, this.servicio, this.turnos,this.empresa_id).subscribe(data => {
          this.turnosm = data.turnos;
          let todasLasFechas: string[] = [];
          this.montoTotal=data.total_general;
          this.totalPasajeros=data.total_pasajeros;
          data.turnos.forEach((ciudad: Ciudad) => {
            todasLasFechas = [...todasLasFechas, ...ciudad.fechas];
          });
          todasLasFechas = [...new Set(todasLasFechas)].sort();
    
          const canvas = document.getElementById('graficoTurno') as HTMLCanvasElement;
          if (!canvas) return;
    
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
    
          // Destruir el gráfico si ya existe
          if (this.chart) {
            this.chart.destroy();
            this.chart = null;  // Limpiar la referencia
          }
          const datasets = data.turnos.map((ciudad: Ciudad, index: number) => {
            const montos = todasLasFechas.map(fecha => {
              const indexFecha = ciudad.fechas.indexOf(fecha);
              return indexFecha >= 0 ? ciudad.montos[indexFecha] : NaN;
            });
    
            const pasajerosData = todasLasFechas.map(fecha => {
              const indexFecha = ciudad.fechas.indexOf(fecha);
              return indexFecha >= 0 ? ciudad.pasajeros[indexFecha] : 0;
            });
            this.actualizarTextoRuta();
    
            return {
              label: `${this.textoRutaSeleccionada} ${ ciudad.nombre} (Total: S/. ${ciudad.total.toLocaleString('es-PE')} - P=${ciudad.total_pasajeros})`,
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
        if (!Array.isArray(this.turnosm)) {
          console.error('Error: turnosm no es un array', this.turnosm);
          return;
        }
      
        this.datosMostrados = this.turnosm.map(ciudadm => ({
          monto_promedio: ciudadm.monto_promedio ? ciudadm.monto_promedio.toLocaleString('es-PE') : 'N/A',
        }));
      }
    
      mostrarMontos() {
        this.datosMostrados = this.turnosm.map(ciudadm => ({
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
      actualizarTextoRuta() {
    const ruta = this.rutasDisponibles.find(r => r.id === this.idRuta);
    if (ruta) {
      this.textoRutaSeleccionada = `${ruta.ciudad_inicial} - ${ruta.ciudad_final}`;
    }
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
