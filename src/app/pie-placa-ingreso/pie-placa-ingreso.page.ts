import { Component, OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';

interface Auto {
  id: number;
  placa: string;
}

interface IngresoAuto {
  placa: string;
  total_monto: number;
  total_pasajeros:number;
  porcentaje:number;
  total_general:number;
  total_pasajeros_general:number;
}

@Component({
  selector: 'app-pie-placa-ingreso',
  standalone: false,
  templateUrl: './pie-placa-ingreso.page.html',
  styleUrls: ['./pie-placa-ingreso.page.scss'],
})
export class PiePlacaIngresoPage implements OnInit {

  chart: any;
  fecha_inicio: string = '';
  fecha_fin: string = '';
  servicio: string = '';
  autos: number[] = [];
  montoTotal: number = 0;
  totalPasajeros: number = 0;
  autosDisponibles: Auto[] = [];
  contador:number=1;
  mostrarFiltros: boolean = true; 
  fechadevuelta: Date = new Date();
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
    this.ingresoService.obtenerAutos(this.empresa_id).subscribe(
      (data: Auto[]) => {
        this.autosDisponibles = data;
      },
      (error) => {
        console.error('Error al obtener autos:', error);
      }
    );
  }

  obtenerYCrearGrafico(): void {
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

    this.ingresoService.obtenerIngresosPPlaca(fechaInicioFormatted, fechaFinFormatted, this.servicio, this.autos,this.empresa_id).subscribe(
      (data: IngresoAuto[]) => {
        console.log(data); 
        const data2 = data;
        if (data2.length > 0) {
          this.montoTotal = data2[0].total_general;
          this.totalPasajeros = data2[0].total_pasajeros_general;
        } else {
          this.montoTotal = 0;
          this.totalPasajeros = 0;
        }
        
        const datosAdicionales = data2.map((item) => ({
          auto: `${item.placa}`,
          monto: item.total_monto,
          pasajeros: item.total_pasajeros,
          porcentaje: item.porcentaje,
        }));
        const canvas = document.getElementById('graficoPieAuto') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (this.chart) {
          this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: datosAdicionales.map((item) => item.auto),
            datasets: [
              {
                label: 'Porcentaje de Monto por Auto',
                data: datosAdicionales.map((item) => item.monto),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const index = context.dataIndex;
                    const monto = datosAdicionales[index].monto.toLocaleString('en-US');
                    const pasajeros = datosAdicionales[index].pasajeros;
                    const porcentaje = datosAdicionales[index].porcentaje;
                    return `S/. ${monto} - ${pasajeros} pasajeros (${porcentaje}%)`;
                  },
                },
              },
              datalabels: {
                formatter: (value, context) => {
                  const index = context.dataIndex;
                  const pasajeros = datosAdicionales[index].pasajeros;
                  return `S/. ${value.toLocaleString('en-US')}\nP(${pasajeros})`;
                },
                color: '#fff',
                font: {
                  weight: 'bold',
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
        
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
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
  limpiarFiltros(): void {
    this.mostrarFiltros = true; 
    this.montoTotal = 0;
    this.totalPasajeros = 0;
    if (this.chart) {
      this.chart.destroy();
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
