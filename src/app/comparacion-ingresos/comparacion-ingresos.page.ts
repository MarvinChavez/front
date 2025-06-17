import { IngresoService } from '../services/ingreso.service';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

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
      this.lockOrientation();

  }
  @ViewChild('canvasComparacion') canvasRef!: ElementRef;

  mostrarGrafico: boolean = false;
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
  mostrarFiltros: boolean = true;
  contador: number = 1;
  empresa_id: number = 0;
leyendaPersonalizada: {
  rango: string;
  monto: string;
  pasajeros: string;
  color: string;
}[] = [];

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
  Chart.register(ChartDataLabels);

  this.mostrarGrafico = true;

  setTimeout(() => {
    const canvas = this.canvasRef?.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    const formatoFecha = (fecha: string | Date): string => {
      const f = new Date(fecha);
      f.setDate(f.getDate() + 1); // Sumar un día
      return f.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const etiquetas = [
      `Rango 1: ${formatoFecha(this.fechaInicio1)} - ${formatoFecha(this.fechaFin1)}`,
      `Rango 2: ${formatoFecha(this.fechaInicio2)} - ${formatoFecha(this.fechaFin2)}`
    ];

    const datos = [data.rango_1.monto_total, data.rango_2.monto_total];
    const pasajeros = [data.rango_1.total_pasajeros, data.rango_2.total_pasajeros];
    const colores = ['#4CAF50', '#FF9800'];
    const total = datos.reduce((sum, val) => sum + val, 0);
this.leyendaPersonalizada = etiquetas.map((label, i) => ({
  rango: label,
  monto: `S/. ${datos[i].toLocaleString('en-US')}`,
  pasajeros: `P: ${pasajeros[i].toLocaleString('en-US')}`,
  color: colores[i]
}));

    this.chart = new Chart(ctx!, {
      type: 'pie',
      data: {
        labels: etiquetas,
        datasets: [{
          data: datos,
          backgroundColor: colores,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                const value = context.raw as number;
                return `S/. ${value.toLocaleString('en-US')} - Pasajeros: ${pasajeros[index].toLocaleString('en-US')}`;
              }
            }
          },
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold'
            },
            formatter: (value, context) => {
              const porcentaje = ((value as number) / total) * 100;
              return `${porcentaje.toFixed(1)}%`;
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }, 100);
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
    this.mostrarGrafico = false;
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
