// Devuelve una paleta de colores según el turno del evento.
export function changeColor(event) {
  // normaliza el texto para comparar sin acentos ni mayúsculas
  const shiftLower = event.observation.toLowerCase();

  if (shiftLower === 'jornada mañana') {
    return {
      backgroundColor: '#fedd07',
      borderColor: '#fedd07',
      textColor: '#000000',
    };
  } else if (shiftLower === 'jornada tarde') {
    return {
      backgroundColor: '#fe9707',
      borderColor: '#fe9707',
      textColor: '#FFFFFF',
    };
  } else if (shiftLower === 'jornada mixta') {
    return {
      backgroundColor: '#ff829b',
      borderColor: '#ff829b',
      textColor: '#FFFFFF',
    };
  } else {
    // por defecto se aplica el color del turno nocturno
    return {
      backgroundColor: '#6d83c9',
      borderColor: '#6d83c9',
      textColor: '#FFFFFF',
    };
  }
}