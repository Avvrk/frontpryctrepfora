/* // Función que clasifica la hora del día
function clasificarHora() {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    
    // Convertir a formato 12 horas para mostrar
    let horaFormato12 = hora;
    let periodo = "AM";
    
    if (hora === 0) {
        horaFormato12 = 12;
    } else if (hora > 12) {
        horaFormato12 = hora - 12;
        periodo = "PM";
    } else if (hora === 12) {
        periodo = "PM";
    }
    
    const horaActual = `${horaFormato12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
    
    // Clasificar según la hora (usando formato 24 horas para la lógica)
    let momento;
    
    if (hora >= 6 && hora < 12) {
        momento = "día";
    } else if (hora >= 12 && hora < 18) {
        momento = "tarde";
    } else {
        momento = "noche";
    }
    
    return {
        horaActual: horaActual,
        momento: momento,
        mensaje: `Son las ${horaActual} y es de ${momento}`
    };
}

// Función alternativa donde puedes especificar una hora manualmente
function clasificarHoraEspecifica(hora, minutos = 0) {
    // Validar entrada
    if (hora < 0 || hora > 23 || minutos < 0 || minutos > 59) {
        return "Hora inválida";
    }
    
    // Convertir a formato 12 horas para mostrar
    let horaFormato12 = hora;
    let periodo = "AM";
    
    if (hora === 0) {
        horaFormato12 = 12;
    } else if (hora > 12) {
        horaFormato12 = hora - 12;
        periodo = "PM";
    } else if (hora === 12) {
        periodo = "PM";
    }
    
    const horaFormateada = `${horaFormato12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
    
    // Clasificar según la hora
    let momento;
    
    if (hora >= 6 && hora < 12) {
        momento = "día";
    } else if (hora >= 12 && hora < 18) {
        momento = "tarde";
    } else {
        momento = "noche";
    }
    
    return {
        horaFormateada: horaFormateada,
        momento: momento,
        mensaje: `Las ${horaFormateada} es de ${momento}`
    };
}

// Ejemplos de uso:

// Obtener la hora actual
console.log(clasificarHora());

// Probar con horas específicas
console.log(clasificarHoraEspecifica(8, 30));   // 8:30 AM - día
console.log(clasificarHoraEspecifica(14, 45));  // 2:45 PM - tarde
console.log(clasificarHoraEspecifica(21, 0));   // 9:00 PM - noche
console.log(clasificarHoraEspecifica(2, 15));   // 2:15 AM - noche

// Probar casos límite
console.log(clasificarHoraEspecifica(6, 0));    // 6:00 AM - día
console.log(clasificarHoraEspecifica(12, 0));   // 12:00 PM - tarde
console.log(clasificarHoraEspecifica(18, 0));   // 6:00 PM - noche */




/* function esDeDia() {
    const hora = new Date().getHours();
    
    if (hora >= 6 && hora < 12) return "día";
    if (hora >= 12 && hora < 18) return "tarde";
    return "noche";
}

console.log(`Es de ${esDeDia()}`); */




function clasificarHora(horaTexto) {
    // Expresión regular para extraer la hora en formato "H:MM A.M." o "HH:MM P.M."
    const regex = /(\d{1,2}):(\d{2})\s*(A\.M\.|P\.M\.)/i;
    const match = horaTexto.match(regex);
    
    if (!match) {
        return "Formato de hora inválido";
    }
    
    let hora = parseInt(match[1]);
    const minutos = parseInt(match[2]);
    const periodo = match[3].toUpperCase();
    
    // Convertir a formato 24 horas
    if (periodo === "P.M." && hora !== 12) {
        hora += 12;
    } else if (periodo === "A.M." && hora === 12) {
        hora = 0;
    }
    
    // Clasificar según la hora
    if (hora >= 5 && hora < 12) {
        return "Mañana";
    } else if (hora >= 12 && hora < 18) {
        return "Tarde";
    } else if (hora >= 18 && hora < 22) {
        return "Noche";
    } else {
        return "Madrugada";
    }
}

// Función alternativa más específica
function clasificarHoraDetallada(horaTexto) {
    const regex = /(\d{1,2}):(\d{2})\s*(A\.M\.|P\.M\.)/i;
    const match = horaTexto.match(regex);
    
    if (!match) {
        return "Formato de hora inválido";
    }
    
    let hora = parseInt(match[1]);
    const minutos = parseInt(match[2]);
    const periodo = match[3].toUpperCase();
    
    // Convertir a formato 24 horas
    if (periodo === "P.M." && hora !== 12) {
        hora += 12;
    } else if (periodo === "A.M." && hora === 12) {
        hora = 0;
    }
    
    // Clasificación detallada
    if (hora >= 0 && hora < 6) {
        return "Madrugada";
    } else if (hora >= 6 && hora < 12) {
        return "Mañana";
    } else if (hora >= 12 && hora < 14) {
        return "Mediodía";
    } else if (hora >= 14 && hora < 18) {
        return "Tarde";
    } else if (hora >= 18 && hora < 21) {
        return "Noche";
    } else {
        return "Noche tardía";
    }
}

// Ejemplos de uso
console.log("=== Ejemplos con clasificación básica ===");
console.log("6:30 A.M. →", clasificarHora("6:30 A.M."));
console.log("12:00 P.M. →", clasificarHora("12:00 P.M."));
console.log("3:45 P.M. →", clasificarHora("3:45 P.M."));
console.log("8:20 P.M. →", clasificarHora("8:20 P.M."));
console.log("11:30 P.M. →", clasificarHora("11:30 P.M."));
console.log("2:15 A.M. →", clasificarHora("2:15 A.M."));

console.log("\n=== Ejemplos con clasificación detallada ===");
console.log("6:30 A.M. →", clasificarHoraDetallada("6:30 A.M."));
console.log("12:00 P.M. →", clasificarHoraDetallada("12:00 P.M."));
console.log("2:30 P.M. →", clasificarHoraDetallada("2:30 P.M."));
console.log("6:45 P.M. →", clasificarHoraDetallada("6:45 P.M."));
console.log("10:30 P.M. →", clasificarHoraDetallada("10:30 P.M."));

// Función para procesar múltiples horas
function procesarHoras(listaHoras) {
    return listaHoras.map(hora => ({
        hora: hora,
        clasificacion: clasificarHora(hora)
    }));
}

// Ejemplo con lista de horas
const horas = ["6:30 A.M.", "12:00 P.M.", "3:30 P.M.", "8:45 P.M.", "1:20 A.M."];
console.log("\n=== Procesamiento de lista ===");
console.table(procesarHoras(horas));