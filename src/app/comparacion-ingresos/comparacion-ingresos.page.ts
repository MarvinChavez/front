import { Component, OnInit } from '@angular/core';
import { ElementRef, AfterViewInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js/auto';
import { ChartType } from 'angular-google-charts';
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
    const storedId = localStorage.getItem('empresa_id');
    if (storedId) {
      this.empresa_id = parseInt(storedId, 10);
    }
  }
  chartType: ChartType = ChartType.PieChart;
  chartDataGoogle: any[] = [];
  chartColumns: string[] = ['Rango', 'Monto'];
  chartOptionsGoogle = {
    title: 'Comparación de ingresos',
    is3D: true,
    legend: {
      position: 'left',
      textStyle: {
        fontSize: 10, // tamaño de la fuente
        fontName: 'Arial', // tipo de fuente
        color: '#333', // color de la fuente
      }
    },
    isStacked: true,
    responsive: true,
    chartArea: { left: 20, top: 40, width: '70%', height: '80%' },
    slices: {
      0: { color: '#3366CC' },
      1: { color: '#DC3912' }
    }
  } as any;
  
  
  mostrarGraficoGoogle: boolean = false;
    chart: any;
  mostrarRutas: boolean = false;
  mostrarOficinas: boolean = false;
  mostrarAutos: boolean = false;
  ingresoTotales: boolean = true;
  ciudadesDisponibles: string[] = [];
  ciudad: string = '';
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
  contador: number = 1;
  empresa_id: number = 0;

  constructor(private ingresoService: IngresoService) { }
  obtenerRutas(): void {
    this.ingresoService.obtenerRutas(this.empresa_id).subscribe((data: Ruta[]) => {  // ⬅️ Cambiar `string[]` por `Ruta[]`
      this.rutasDisponibles = data;
    }, error => {
      console.error('Error al obtener rutas:', error);
    });
  }
  obtenerCiudades(): void {
    this.ingresoService.obtenerCiudades(this.empresa_id).subscribe((data: string[]) => {
      this.ciudadesDisponibles = data;
    }, error => {
      console.error('Error al obtener ciudades:', error);
    });
  }
  obtenerAutos(): void {
    this.ingresoService.obtenerAutos(this.empresa_id).subscribe((data: Auto[]) => {  // ⬅️ Cambiar `string[]` por `Ruta[]`
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
    this.mostrarFiltros = false;
    if (this.ingresoTotales) {
      this.ingresoService.obtenerComparacionTotales(this.empresa_id,this.fechaInicio1, this.fechaFin1, this.fechaInicio2, this.fechaFin2)
        .subscribe(response => {
          this.totalPasajeros1 = response.rango_1.total_pasajeros;
          this.montoTotal1 = response.rango_1.monto_total;
          this.totalPasajeros2 = response.rango_2.total_pasajeros;
          this.montoTotal2 = response.rango_2.monto_total;
          this.crearGraficoLineas(response);
        }, error => {
          console.error('Error obteniendo datos:', error);
        });
    }
    if (this.mostrarAutos) {
      if (!this.autoId) {
        alert('Por favor, selecciona el auto.');
        return;
      }
      this.ingresoService.obtenerComparacionAuto(this.empresa_id,this.autoId, this.fechaInicio1, this.fechaFin1, this.fechaInicio2, this.fechaFin2)
        .subscribe(response => {
          this.totalPasajeros1 = response.rango_1.total_pasajeros;
          this.montoTotal1 = response.rango_1.monto_total;
          this.totalPasajeros2 = response.rango_2.total_pasajeros;
          this.montoTotal2 = response.rango_2.monto_total;
          this.crearGraficoLineas(response);
        }, error => {
          console.error('Error obteniendo datos:', error);
        });
    }
    if (this.mostrarRutas) {
      if (!this.rutaId) {
        alert('Por favor, selecciona ruta.');
        return;
      }
      this.ingresoService.obtenerComparacionRuta(this.empresa_id,this.rutaId, this.fechaInicio1, this.fechaFin1, this.fechaInicio2, this.fechaFin2)
        .subscribe(response => {
          this.totalPasajeros1 = response.rango_1.total_pasajeros;
          this.montoTotal1 = response.rango_1.monto_total;
          this.totalPasajeros2 = response.rango_2.total_pasajeros;
          this.montoTotal2 = response.rango_2.monto_total;
          this.crearGraficoLineas(response);
        }, error => {
          console.error('Error obteniendo datos:', error);
        });
    }
    if (this.mostrarOficinas) {
      if (!this.ciudad) {
        alert('Por favor, selecciona ciudad.');
        return;
      }
      this.ingresoService.obtenerComparacionOficina(this.empresa_id,this.ciudad, this.fechaInicio1, this.fechaFin1, this.fechaInicio2, this.fechaFin2)
        .subscribe(response => {
          this.totalPasajeros1 = response.rango_1.total_pasajeros;
          this.montoTotal1 = response.rango_1.monto_total;
          this.totalPasajeros2 = response.rango_2.total_pasajeros;
          this.montoTotal2 = response.rango_2.monto_total;
          this.crearGraficoLineas(response);
        }, error => {
          console.error('Error obteniendo datos:', error);
        });
    }
  }

  crearGraficoLineas(data: any) {
    const pasajeros1 = data.rango_1.total_pasajeros;
    const monto1 = data.rango_1.monto_total;

    const pasajeros2 = data.rango_2.total_pasajeros;
    const monto2 = data.rango_2.monto_total;
    this.chartOptionsGoogle = {
      title: 'Comparación de ingresos',
      is3D: true,
      legend: {
        position: 'left',
        textStyle: {
          fontSize: 10, // tamaño de la fuente
          fontName: 'Arial', // tipo de fuente
          color: '#333', // color de la fuente
        }
      },
      isStacked: true,
      responsive: true,
      chartArea: { left: 20, top: 40, width: '70%', height: '80%' },
      slices: {
        0: { color: '#3366CC' },
        1: { color: '#DC3912' }
      }
    } as any;
    this.chartDataGoogle = [
      [`Rango 1: ${pasajeros1} pasajeros, S/. ${monto1}`, monto1],
      [`Rango 2: ${pasajeros2} pasajeros, S/. ${monto2}`, monto2]
    ];
    this.mostrarGraficoGoogle = true;
  }
  
  seleccionTotales(): void {
    this.ingresoTotales = true;
    this.mostrarOficinas = false;
    this.mostrarAutos = false;
    this.mostrarRutas = false;
  }
  seleccionCiudad(): void {
    this.mostrarOficinas = true;
    this.mostrarAutos = false;
    this.mostrarRutas = false;
    this.ingresoTotales = false;
    this.obtenerCiudades();
  }
  seleccionRuta(): void {
    this.mostrarRutas = true;
    this.mostrarOficinas = false;
    this.mostrarAutos = false;
    this.ingresoTotales = false;
    this.obtenerRutas();
  }
  seleccionPlaca(): void {
    this.mostrarAutos = true;
    this.mostrarRutas = false;
    this.mostrarOficinas = false;
    this.ingresoTotales = false;
    this.obtenerAutos();
  }
  limpiarFiltros(): void {
    this.mostrarFiltros = true;
    this.montoTotal1 = 0;
    this.montoTotal2 = 0;
    this.totalPasajeros1 = 0;
    this.totalPasajeros2 = 0;
    this.mostrarGraficoGoogle = false;
    this.chartOptionsGoogle = {
      title: 'Comparación de ingresos',
      is3D: true,
      legend: {
        position: 'left',
        textStyle: {
          fontSize: 10, // tamaño de la fuente
          fontName: 'Arial', // tipo de fuente
          color: '#333', // color de la fuente
        }
      },
      isStacked: true,
      responsive: true,
      chartArea: { left: 5, top: 20, width: '70%', height: '80%' },
      slices: {
        0: { color: '#3366CC' },
        1: { color: '#DC3912' }
      }
    } as any;
    
  }

}
