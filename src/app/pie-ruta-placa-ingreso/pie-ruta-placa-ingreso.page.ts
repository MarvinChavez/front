import { Component, OnInit } from '@angular/core';
import { IngresoService } from '../services/ingreso.service';
import { ChartType } from 'angular-google-charts';
import { ChangeDetectorRef } from '@angular/core';
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';

interface Auto {
  id: number;
  placa: string;
}

interface IngresoData {
  labels: string[];
  data: number[];
  numeroTurnos: number[];
  pasajerosPorRuta: number[];
  total: number;
  total_pasajeros_general: number;
  
}

@Component({
  selector: 'app-pie-ruta-placa-ingreso',
  standalone: false,
  templateUrl: './pie-ruta-placa-ingreso.page.html',
  styleUrls: ['./pie-ruta-placa-ingreso.page.scss'],
})
export class PieRutaPlacaIngresoPage implements OnInit {
  public pieChart = {
    chartType: ChartType.PieChart, // Tipo de gráfico
    dataTable: [['Ruta', 0]], // Inicialización válida
    options: {
      title: 'Monto por Ruta',
      is3D: true, 
      pieSliceText: 'value',
      tooltip: { text: 'percentage' },
      legend: { position: 'labeled', textStyle: { fontSize: 12 } },
      width: 700,   // Aumenta el ancho
      height: 500,  // Aumenta la altura
      chartArea: {
        width: '80%', // Permite que el gráfico ocupe más espacio
        height: '70%'
      }
    }
  };
  fecha_inicio: string = '';
  fecha_fin: string = '';
  servicio: string = '';
  autoId: number = 0;
  autosDisponibles: Auto[] = [];
  montoTotal: number = 0;
  totalPasajeros: number = 0;
  contador:number=1;
  mostrarFiltros: boolean = true; 
  fechadevuelta: Date = new Date();
  empresa_id: number = 0;

  constructor(private ingresoService: IngresoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('empresa_id');
    if (storedId) {
      this.empresa_id = parseInt(storedId, 10);
    }
    this.lockOrientation();
    this.obtenerCiudades();
    this.obtenerFechaUltima();
    this.setChartSize();
  window.addEventListener('resize', () => this.setChartSize());
  }
  obtenerFechaUltima(): void {
    this.ingresoService.obtenerFecha(this.empresa_id).subscribe(fecha => {
        this.fechadevuelta = new Date(fecha);
        this.setPeriodo('semana');
    });
}
  setChartSize() {
    const windowHeight = window.innerHeight; // Altura total de la pantalla
    const isMobile = window.innerWidth < 768; // Detecta si es móvil
  
    // Elementos a restar
    const headerHeight = document.querySelector('.botones-container')?.clientHeight || 50;
    const filterHeight = document.querySelector('form')?.clientHeight || 150;
    const titleHeight = document.querySelector('ion-card-header')?.clientHeight || 50;
    const infoHeight = document.querySelector('ion-card-content')?.clientHeight || 50;
    const extraMargin = isMobile ? 30 : 20; // Mayor margen en móvil
  
    // Calcular espacio disponible
    let availableHeight = windowHeight - (headerHeight + filterHeight + titleHeight + infoHeight + extraMargin);
  
    // Aplicar tamaño mínimo y máximo
    availableHeight = Math.max(availableHeight, isMobile ? 250 : 300); // Mínimo 250px en móvil, 300px en PC
  
    this.pieChart.options.height = availableHeight;
    this.pieChart.options.width = isMobile ? window.innerWidth * 0.95 : Math.min(window.innerWidth * 0.9, 900);
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

    this.ingresoService.obtenerIngresosPRutaPlaca(this.autoId, fechaInicioFormatted, fechaFinFormatted, this.servicio,this.empresa_id).subscribe(
      (data: IngresoData) => {
        console.log(data);
        
        const chartData: Array<[string, number]> = [];

        data.labels.forEach((label, index) => {
          const turnos = data.numeroTurnos[index];
          const monto = data.data[index]; 
          const pasajeros = data.pasajerosPorRuta[index];

          chartData.push([`${label} (Turnos: ${turnos}, Pasajeros: ${pasajeros})`, monto]);
        });
        this.montoTotal = data.total;
      this.totalPasajeros = data.total_pasajeros_general;
      
      if (chartData.length > 0) {
        this.pieChart = {
          chartType: ChartType.PieChart,
        dataTable: [['Ruta', 0], ...chartData],
        options: this.pieChart.options, // Mantiene las opciones
        };
        
        this.cdr.detectChanges(); 
      } else {
      }

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
    if (this.pieChart) {
      this.pieChart = {
        chartType: ChartType.PieChart,
      dataTable: [['Ruta', 0]],
      options: this.pieChart.options, 
      };
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