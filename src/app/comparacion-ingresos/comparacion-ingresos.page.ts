import { Component, OnInit } from '@angular/core';
import { ElementRef, AfterViewInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js/auto';
import { ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface Auto {
  id: number;
  placa: string;
}
interface Ruta {
  id: number;
  ciudad_inicial: string;
  ciudad_final: string;
}
@Component({
  selector: 'app-comparacion-ingresos',
  templateUrl: './comparacion-ingresos.page.html',
  standalone: false,
  styleUrls: ['./comparacion-ingresos.page.scss'],
})
export class ComparacionIngresosPage implements OnInit {

  ngOnInit() {
    
  }
  @ViewChild('lineChart', { static: false }) lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;
  mostrarRutas:boolean = false;
  mostrarOficinas:boolean = false;
  mostrarAutos:boolean = false;
  ingresoTotales:boolean = true;
  ciudadesDisponibles: string[] = [];
  ciudad: string= '';
  autoId: number = 0;
  fechaInicio1: string = '';
  fechaFin1: string = '';
  fechaInicio2: string = '';
  fechaFin2: string = '';
  autosDisponibles: Auto[] = [];
  rutasDisponibles: Ruta[] = [];
  rutaId: number = 0;
  montoTotal1: number = 0;
  totalPasajeros1: number = 0;
  montoTotal2: number = 0;
  totalPasajeros2: number = 0;
  chartData: ChartData<'line'> | null = null;
  chartLabels: string[] = [];
  mostrarFiltros: boolean = true; 
  contador:number=1;

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    }
  };

  constructor(private ingresoService: IngresoService) {}
  obtenerRutas(): void {
    this.ingresoService.obtenerRutas().subscribe((data: Ruta[]) => {  // ⬅️ Cambiar `string[]` por `Ruta[]`
      this.rutasDisponibles = data;
    }, error => {
      console.error('Error al obtener rutas:', error);
    });
  }
  obtenerCiudades(): void {
    this.ingresoService.obtenerCiudades().subscribe((data: string[]) => {
      this.ciudadesDisponibles = data;
    }, error => {
      console.error('Error al obtener ciudades:', error);
    });
  }
  obtenerAutos(): void {
    this.ingresoService.obtenerAutos().subscribe((data: Auto[]) => {  // ⬅️ Cambiar `string[]` por `Ruta[]`
      this.autosDisponibles = data;
    }, error => {
      console.error('Error al obtener autos:', error);
    });
  }
  obtenerComparacion() {
    if (!this.fechaInicio1 || !this.fechaFin1 || !this.fechaInicio2 || !this.fechaFin2) {
      alert('Por favor, completa las fechas.');
      return;
    }
    this.mostrarFiltros=false;
    if(this.ingresoTotales){
      this.ingresoService.obtenerComparacionTotales(this.fechaInicio1, this.fechaFin1, this.fechaInicio2, this.fechaFin2)
      .subscribe(response => {
        this.totalPasajeros1=response.rango_1.total_pasajeros;
        this.montoTotal1=response.rango_1.monto_total;
        this.totalPasajeros2=response.rango_2.total_pasajeros;
        this.montoTotal2=response.rango_2.monto_total;
        this.crearGrafico(response);
      }, error => {
        console.error('Error obteniendo datos:', error);
      });
    }
    if(this.mostrarAutos){
      if (!this.autoId) {
        alert('Por favor, selecciona el auto.');
        return;
      }
      this.ingresoService.obtenerComparacionAuto(this.autoId, this.fechaInicio1, this.fechaFin1, this.fechaInicio2, this.fechaFin2)
      .subscribe(response => {
        this.totalPasajeros1=response.rango_1.total_pasajeros;
        this.montoTotal1=response.rango_1.monto_total;
        this.totalPasajeros2=response.rango_2.total_pasajeros;
        this.montoTotal2=response.rango_2.monto_total;
        this.crearGrafico(response);
      }, error => {
        console.error('Error obteniendo datos:', error);
      });
    }
    if(this.mostrarRutas){
      if (!this.rutaId) {
        alert('Por favor, selecciona ruta.');
        return;
      }
      this.ingresoService.obtenerComparacionRuta(this.rutaId, this.fechaInicio1, this.fechaFin1, this.fechaInicio2, this.fechaFin2)
      .subscribe(response => {
        this.totalPasajeros1=response.rango_1.total_pasajeros;
        this.montoTotal1=response.rango_1.monto_total;
        this.totalPasajeros2=response.rango_2.total_pasajeros;
        this.montoTotal2=response.rango_2.monto_total;
        this.crearGrafico(response);
      }, error => {
        console.error('Error obteniendo datos:', error);
      });
    }
    if(this.mostrarOficinas){
      if (!this.ciudad) {
        alert('Por favor, selecciona ciudad.');
        return;
      }
      this.ingresoService.obtenerComparacionOficina(this.ciudad, this.fechaInicio1, this.fechaFin1, this.fechaInicio2, this.fechaFin2)
      .subscribe(response => {
        this.totalPasajeros1=response.rango_1.total_pasajeros;
        this.montoTotal1=response.rango_1.monto_total;
        this.totalPasajeros2=response.rango_2.total_pasajeros;
        this.montoTotal2=response.rango_2.monto_total;
        this.crearGrafico(response);
      }, error => {
        console.error('Error obteniendo datos:', error);
      });
    }
  }

  crearGrafico(data: any) {
    const labels = Array.from(
      new Set([
        ...Object.keys(data.rango_1.detalles),
        ...Object.keys(data.rango_2.detalles)
      ])
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
    // 🔹 Función para obtener los montos alineados con las fechas ordenadas
    const obtenerMontos = (detalles: Record<string, { monto: number }>, labels: string[]) =>
      labels.map(fecha => detalles[fecha]?.monto ?? null); // Usa `null` en lugar de `0` para puntos desconectados
  
    const datosMonto1 = obtenerMontos(data.rango_1.detalles, labels);
    const datosMonto2 = obtenerMontos(data.rango_2.detalles, labels);
  
    if (this.chart) {
      this.chart.destroy(); // 🔄 Eliminar gráfico anterior si existe
    }
  
    this.chart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Rango 1',
            data: datosMonto1,
            borderColor: 'blue',
            backgroundColor: 'blue',
            fill: false,
            spanGaps: false
          },
          {
            label: 'Rango 2',
            data: datosMonto2,
            borderColor: 'red',
            backgroundColor: 'red',
            fill: false,
            spanGaps: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = 'Monto';
                if (context.parsed.y !== null) {
                  label += ': ' + new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                  }).format(context.parsed.y);
                }
                return `${label}`;
              },
              title: function (context) {
                return new Date(context[0].parsed.x).toLocaleDateString('es-PE', {
                  day: 'numeric',
                  month: 'long'
                });
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'day' },
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
              text: 'Importe (S/.)',
              color: '#333',
              font: { size: 16 }
            },
            grid: { color: 'rgba(200, 200, 200, 0.1)' }
          }
        }
      }
    });
  }
  
  seleccionTotales(): void {
    this.ingresoTotales=true;
    this.mostrarOficinas = false; 
    this.mostrarAutos=false;
    this.mostrarRutas=false;
    this.ingresoTotales=false;
  }
  seleccionCiudad(): void {
    this.mostrarOficinas = true; 
    this.mostrarAutos=false;
    this.mostrarRutas=false;
    this.ingresoTotales=false;
    this.obtenerCiudades();
  }
  seleccionRuta(): void {
    this.mostrarRutas = true; 
    this.mostrarOficinas = false; 
    this.mostrarAutos=false;
    this.ingresoTotales=false;
    this.obtenerRutas();
  }
  seleccionPlaca(): void {
    this.mostrarAutos = true; 
    this.mostrarRutas = false; 
    this.mostrarOficinas = false; 
    this.ingresoTotales=false;
    this.obtenerAutos();
  }
  limpiarFiltros(): void {
    this.mostrarFiltros = true; 
    this.montoTotal1 = 0;
    this.montoTotal2 = 0;
    this.totalPasajeros1 = 0;
    this.totalPasajeros2 = 0;
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
