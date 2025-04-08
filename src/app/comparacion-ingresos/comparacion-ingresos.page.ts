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
        this.crearGraficoLineas(response);
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
        this.crearGraficoLineas(response);
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
        this.crearGraficoLineas(response);
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
        this.crearGraficoLineas(response);
      }, error => {
        console.error('Error obteniendo datos:', error);
      });
    }
  }

  crearGraficoLineas(data: any) {
    const monto1 = data.rango_1.monto_total;
  const monto2 = data.rango_2.monto_total;

  if (this.chart) {
    this.chart.destroy(); // Elimina el gráfico anterior si existe
  }

  this.chart = new Chart(this.lineChartCanvas.nativeElement, {
    type: 'bar',
    data: {
      labels: ['Rango 1', 'Rango 2'],
      datasets: [{
        label: 'Monto total',
        data: [monto1, monto2],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)', // azul
          'rgba(255, 99, 132, 0.7)'  // rojo
        ],
        borderColor: ['#fff', '#fff'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN'
              }).format(context.parsed.y);
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Rangos Comparados',
            color: '#333',
            font: { size: 16 }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Monto Total (S/.)',
            color: '#333',
            font: { size: 16 }
          },
          beginAtZero: true,
          grid: { color: 'rgba(200, 200, 200, 0.1)' }
        }
      }
    }
  });
  }
  crearGraficobarras(data: any) {
    const monto1 = data.rango_1.monto_total;
  const monto2 = data.rango_2.monto_total;
  const total = monto1 + monto2;

  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart(this.lineChartCanvas.nativeElement, {
    type: 'pie',
    data: {
      labels: ['Rango 1', 'Rango 2'],
      datasets: [{
        data: [monto1, monto2],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)', // azul
          'rgba(255, 99, 132, 0.7)'  // rojo
        ],
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.parsed;
              const porcentaje = ((value / total) * 100).toFixed(2);
              const monto = new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN'
              }).format(value);
              return `${label}: ${monto} (${porcentaje}%)`;
            }
          }
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
