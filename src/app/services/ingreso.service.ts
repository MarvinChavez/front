import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // 🔹 Importa 'map' correctamente

interface Ruta {
  id: number;
  ciudad_inicial: string;
  ciudad_final: string;
}
interface Turno {
  id: number;
  hora: string;
}
interface Auto {
  id: number;
  placa: string;
}
@Injectable({
  providedIn: 'root',
})
export class IngresoService {
  private apiUrl = 'http://127.0.0.1:8000/ingreso/';

  constructor(private http: HttpClient) {}

  obtenerIngresos(fecha_inicio: string, fecha_fin: string, servicio: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('fecha_inicio', fecha_inicio);
    params.set('fecha_fin', fecha_fin);
    if (servicio) {
      params.set('servicio', servicio);
    }

    return this.http.get<any>(`${this.apiUrl+'filtrar_ingresos'}?${params.toString()}`);
  }
  obtenerIngresosRuta(fecha_inicio: string,servicio: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('fecha_inicio', fecha_inicio);
    if (servicio) {
      params.set('servicio', servicio);
    }
    return this.http.get<any>(`${this.apiUrl+'bingresosruta'}?${params.toString()}`);
  }
  obtenerIngresosOficina(fecha_inicio: string,servicio: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('fecha_inicio', fecha_inicio);
    if (servicio) {
      params.set('servicio', servicio);
    }
    return this.http.get<any>(`${this.apiUrl+'bingresosoficina'}?${params.toString()}`);
  }
  obtenerIngresosTurno(fecha_inicio: string,servicio: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('fecha_inicio', fecha_inicio);
    if (servicio) {
      params.set('servicio', servicio);
    }
    return this.http.get<any>(`${this.apiUrl+'bingresosturno'}?${params.toString()}`);
  }
  obtenerIngresosTOficina(fecha_inicio: string, fecha_fin: string, servicio: string, ciudades: string[]): Observable<any> {
    let params = new HttpParams()
      .set('fecha_inicio', fecha_inicio)
      .set('fecha_fin', fecha_fin);
    if (servicio) {
      params = params.set('servicio', servicio);
    }
    if (ciudades.length > 0) { 
      ciudades.forEach(ciudad => {
        params = params.append('ciudades', ciudad);
      });
    } else {
      params = params.set('ciudades', '');
    }

    console.log(params.toString());
    return this.http.get<any>(`${this.apiUrl}filtrar-oficina`, { params });
  }
  obtenerCiudades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}ciudades`);
  }
  obtenerFecha(): Observable<Date> {
    return this.http.get<{ fecha: string }>(`${this.apiUrl}ultima-fecha`).pipe(
        map(response => new Date(response.fecha)) // Convierte el string a Date
    );
}


  
  obtenerIngresosTRuta(fecha_inicio: string, fecha_fin: string, servicio: string, rutas: number[]): Observable<any> {
    let params = new HttpParams()
      .set('fecha_inicio', fecha_inicio)
      .set('fecha_fin', fecha_fin);
  
    if (servicio) {
      params = params.set('servicio', servicio);
    }
  
    if (rutas.length > 0) { 
      rutas.forEach(ruta => {
        params = params.append('rutas', ruta.toString());
      });
    }
    console.log(params.toString());
    return this.http.get<any>(`${this.apiUrl}filtrar-ruta`, { params });
  }
  
  obtenerRutas(): Observable<Ruta[]> { 
    return this.http.get<Ruta[]>(`${this.apiUrl}rutas`);
  }
  obtenerIngresosTAuto(fecha_inicio: string, fecha_fin: string, servicio: string, autos: number[]): Observable<any> {
    let params = new HttpParams()
      .set('fecha_inicio', fecha_inicio)
      .set('fecha_fin', fecha_fin);
  
    if (servicio) {
      params = params.set('servicio', servicio);
    }
  
    if (autos.length > 0) { 
      autos.forEach(auto => {
        params = params.append('autos', auto.toString());
      });
    }
    console.log(params.toString());
    return this.http.get<any>(`${this.apiUrl}filtrar-auto`, { params });
  }
  obtenerAutos(): Observable<Auto[]> {  
    return this.http.get<Auto[]>(`${this.apiUrl}autos`);
  }
  obtenerIngresosTTurno(idRuta:number,fecha_inicio: string, fecha_fin: string, servicio: string, turnos: number[]): Observable<any> {
    let params = new HttpParams()
      .set('fecha_inicio', fecha_inicio)
      .set('fecha_fin', fecha_fin)
      .set('idRuta', idRuta);
  
    if (servicio) {
      params = params.set('servicio', servicio);
    }
  
    if (turnos.length > 0) { 
      turnos.forEach(turno => {
        params = params.append('turnos', turno.toString());
      });
    }
    console.log(params.toString());
    return this.http.get<any>(`${this.apiUrl}ingresos_turno`, { params });
  }
  obtenerTurnos(rutaId: number, servicio: string): Observable<Turno[]> {  
    return this.http.get<Turno[]>(`${this.apiUrl}obtener_turnos_por_ruta?ruta_id=${rutaId}&servicio=${servicio}`);
}

obtenerIngresosPRuta(fecha_inicio: string, fecha_fin: string, servicio: string, rutas: number[]): Observable<any> {
  let params = new HttpParams()
    .set('fecha_inicio', fecha_inicio)
    .set('fecha_fin', fecha_fin);
  if (servicio) {
    params = params.set('servicio', servicio);
  }

  if (rutas.length > 0) { 
    rutas.forEach(ruta => {
      params = params.append('rutas', ruta.toString());
    });
  }
  console.log(params.toString());
  return this.http.get<any>(`${this.apiUrl}pieingresos_rutas`, { params });
}
obtenerIngresosPPlaca(fecha_inicio: string, fecha_fin: string, servicio: string, autos: number[]): Observable<any> {
  let params = new HttpParams()
    .set('fecha_inicio', fecha_inicio)
    .set('fecha_fin', fecha_fin);
  if (servicio) {
    params = params.set('servicio', servicio);
  }

  if (autos.length > 0) { 
    autos.forEach(auto => {
      params = params.append('autos', auto.toString());
    });
  }
  console.log(params.toString());
  return this.http.get<any>(`${this.apiUrl}pieingresos_autos`, { params });
}

obtenerIngresosPRutaPlaca(auto_id:number,fecha_inicio: string, fecha_fin: string, servicio: string): Observable<any> {
  let params = new HttpParams()
    .set('fecha_inicio', fecha_inicio)
    .set('fecha_fin', fecha_fin)
    .set('auto_id', auto_id);
  if (servicio) {
    params = params.set('servicio', servicio);
  }

  console.log(params.toString());
  return this.http.get<any>(`${this.apiUrl}ingresos_rutas_auto`, { params });
}
obtenerComparacionTotales(fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}comparaciontotales?fecha_inicio_1=${fechaInicio1}&fecha_fin_1=${fechaFin1}&fecha_inicio_2=${fechaInicio2}&fecha_fin_2=${fechaFin2}`);
}
obtenerComparacionAuto(auto_id: number, fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}comparacionauto?auto_id=${auto_id}&fecha_inicio_1=${fechaInicio1}&fecha_fin_1=${fechaFin1}&fecha_inicio_2=${fechaInicio2}&fecha_fin_2=${fechaFin2}`);
}
obtenerComparacionRuta(ruta_id: number, fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}comparacionruta?ruta_id=${ruta_id}&fecha_inicio_1=${fechaInicio1}&fecha_fin_1=${fechaFin1}&fecha_inicio_2=${fechaInicio2}&fecha_fin_2=${fechaFin2}`);
}
obtenerComparacionOficina(oficina: string, fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}comparacionoficina?oficina=${oficina}&fecha_inicio_1=${fechaInicio1}&fecha_fin_1=${fechaFin1}&fecha_inicio_2=${fechaInicio2}&fecha_fin_2=${fechaFin2}`);
}

}
