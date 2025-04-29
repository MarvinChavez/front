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

  obtenerIngresos(fecha_inicio: string, fecha_fin: string, servicio: string, empresa_id: number): Observable<any> {
    const params = new URLSearchParams();
    params.set('fecha_inicio', fecha_inicio);
    params.set('fecha_fin', fecha_fin);
    if (servicio) {
      params.set('servicio', servicio);
    }
    params.set('empresa_id', empresa_id.toString());

    return this.http.get<any>(`${this.apiUrl+'filtrar_ingresos'}?${params.toString()}`);
  }
  obtenerIngresosRuta(fecha_inicio: string, servicio: string, empresa_id: number): Observable<any> {
    const params = new URLSearchParams();
    params.set('fecha_inicio', fecha_inicio);
    if (servicio) {
      params.set('servicio', servicio);
    }
    params.set('empresa_id', empresa_id.toString());
    return this.http.get<any>(`${this.apiUrl}bingresosruta?${params.toString()}`);
}

  obtenerIngresosOficina(fecha_inicio: string,servicio: string,empresa_id: number): Observable<any> {
    const params = new URLSearchParams();
    params.set('fecha_inicio', fecha_inicio);
    if (servicio) {
      params.set('servicio', servicio);
    }
    params.set('empresa_id', empresa_id.toString());

    return this.http.get<any>(`${this.apiUrl+'bingresosoficina'}?${params.toString()}`);
  }
  obtenerIngresosTurno(fecha_inicio: string,servicio: string,empresa_id: number): Observable<any> {
    const params = new URLSearchParams();
    params.set('fecha_inicio', fecha_inicio);
    if (servicio) {
      params.set('servicio', servicio);
    }
    params.set('empresa_id', empresa_id.toString());

    return this.http.get<any>(`${this.apiUrl+'bingresosturno'}?${params.toString()}`);
  }
  obtenerIngresosTOficina(fecha_inicio: string, fecha_fin: string, servicio: string, ciudades: string[],empresa_id: number): Observable<any> {
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
    params = params.set('empresa_id', empresa_id.toString()); // Asegúrate de usar `set` en lugar de `params.set` para el último parámetro.

    console.log(params.toString());
    return this.http.get<any>(`${this.apiUrl}filtrar-oficina`, { params });
  }
  obtenerCiudades(empresa_id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}ciudades`, {
      params: { empresa_id: empresa_id.toString() }
    });
  }
  
  obtenerFecha(empresa_id: number): Observable<Date> {
    return this.http.get<{ fecha: string }>(`${this.apiUrl}ultima-fecha`, {
        params: { empresa_id: empresa_id.toString() }  // ✅ Se agrega el parámetro 'empresa_id' a la solicitud
    }).pipe(
        map(response => new Date(response.fecha)) // Convierte el string a Date
    );
}

  obtenerIngresosTRuta(fecha_inicio: string, fecha_fin: string, servicio: string, rutas: number[],empresa_id: number): Observable<any> {
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
    params = params.set('empresa_id', empresa_id.toString()); // Asegúrate de usar `set` en lugar de `params.set` para el último parámetro.

    console.log(params.toString());
    return this.http.get<any>(`${this.apiUrl}filtrar-ruta`, { params });
  }
  
  obtenerRutas(empresa_id: number): Observable<Ruta[]> { 
    return this.http.get<Ruta[]>(`${this.apiUrl}rutas`, {
      params: { empresa_id: empresa_id.toString() }
    });
  }
  
  obtenerIngresosTAuto(fecha_inicio: string, fecha_fin: string, servicio: string, autos: number[],empresa_id: number): Observable<any> {
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
    params = params.set('empresa_id', empresa_id.toString()); // Asegúrate de usar `set` en lugar de `params.set` para el último parámetro.

    console.log(params.toString());
    return this.http.get<any>(`${this.apiUrl}filtrar-auto`, { params });
  }
  obtenerAutos(empresa_id: number): Observable<Auto[]> {
    return this.http.get<Auto[]>(`${this.apiUrl}autos`, {
      params: { empresa_id: empresa_id.toString() }
    });
  }
  obtenerIngresosTTurno(idRuta:number,fecha_inicio: string, fecha_fin: string, servicio: string, turnos: number[],empresa_id: number): Observable<any> {
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
    params = params.set('empresa_id', empresa_id.toString()); // Asegúrate de usar `set` en lugar de `params.set` para el último parámetro.

    console.log(params.toString());
    return this.http.get<any>(`${this.apiUrl}ingresos_turno`, { params });
  }
  obtenerTurnos(rutaId: number, servicio: string): Observable<Turno[]> {  
    return this.http.get<Turno[]>(`${this.apiUrl}obtener_turnos_por_ruta?ruta_id=${rutaId}&servicio=${servicio}`);
}

obtenerIngresosPRuta(fecha_inicio: string, fecha_fin: string, servicio: string, rutas: number[], empresa_id: number): Observable<any> {
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
  params = params.set('empresa_id', empresa_id.toString()); // Asegúrate de usar `set` en lugar de `params.set` para el último parámetro.

  console.log(params.toString());
  return this.http.get<any>(`${this.apiUrl}pieingresos_rutas`, { params });
}

obtenerIngresosPPlaca(fecha_inicio: string, fecha_fin: string, servicio: string, autos: number[],empresa_id: number): Observable<any> {
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
  params = params.set('empresa_id', empresa_id.toString()); // Asegúrate de usar `set` en lugar de `params.set` para el último parámetro.

  console.log(params.toString());
  return this.http.get<any>(`${this.apiUrl}pieingresos_autos`, { params });
}

obtenerIngresosPRutaPlaca(auto_id:number,fecha_inicio: string, fecha_fin: string, servicio: string,empresa_id: number): Observable<any> {
  let params = new HttpParams()
    .set('fecha_inicio', fecha_inicio)
    .set('fecha_fin', fecha_fin)
    .set('auto_id', auto_id);
  if (servicio) {
    params = params.set('servicio', servicio);
  }
  params = params.set('empresa_id', empresa_id.toString()); // Asegúrate de usar `set` en lugar de `params.set` para el último parámetro.

  console.log(params.toString());
  return this.http.get<any>(`${this.apiUrl}ingresos_rutas_auto`, { params });
}
obtenerComparacionTotales(empresa_id: number,fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}comparaciontotales?empresa_id=${empresa_id}&fecha_inicio_1=${fechaInicio1}&fecha_fin_1=${fechaFin1}&fecha_inicio_2=${fechaInicio2}&fecha_fin_2=${fechaFin2}`);
}
obtenerComparacionAuto(empresa_id: number,auto_id: number, fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}comparacionauto?empresa_id=${empresa_id}&auto_id=${auto_id}&fecha_inicio_1=${fechaInicio1}&fecha_fin_1=${fechaFin1}&fecha_inicio_2=${fechaInicio2}&fecha_fin_2=${fechaFin2}`);
}
obtenerComparacionRuta(empresa_id: number,ruta_id: number, fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}comparacionruta?empresa_id=${empresa_id}&ruta_id=${ruta_id}&fecha_inicio_1=${fechaInicio1}&fecha_fin_1=${fechaFin1}&fecha_inicio_2=${fechaInicio2}&fecha_fin_2=${fechaFin2}`);
}
obtenerComparacionOficina(empresa_id: number,oficina: string, fechaInicio1: string, fechaFin1: string, fechaInicio2: string, fechaFin2: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}comparacionoficina?empresa_id=${empresa_id}&oficina=${oficina}&fecha_inicio_1=${fechaInicio1}&fecha_fin_1=${fechaFin1}&fecha_inicio_2=${fechaInicio2}&fecha_fin_2=${fechaFin2}`);
}

}
