// Convierte un texto de hora (ej. "10:30 P.M.") a minutos desde la medianoche.
export function parseTimeToMinutes(timeText) {
  if (!timeText) return NaN;
  const text = timeText.trim();

  // Manejo de formato de 12 horas con indicación A.M./P.M.
  if (/A\.M\.|P\.M\./i.test(text)) {
    const [time, period] = text.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (/P\.M\./i.test(period) && h !== 12) h += 12; // convierte PM a formato 24h
    if (/A\.M\./i.test(period) && h === 12) h = 0; // 12 A.M. corresponde a 00h
    return h * 60 + m;
  }

  // Para horas en formato 24h simplemente se calcula
  const [h, m] = text.split(':').map(Number);
  return h * 60 + m;
}

// Genera tres eventos diarios (mañana, tarde y noche) para un rango de fechas.
export function generateDailyEvents(startDate, endDate) {
  const events = [];
  const start = new Date(startDate.replace(/\//g, '-'));
  const end = new Date(endDate.replace(/\//g, '-'));

  // recorre cada día dentro del rango
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const baseDate = new Date(date);
    baseDate.setDate(baseDate.getDate() + 1);

    // se crean los tres turnos básicos
    events.push(
      {
        start: new Date(baseDate.setHours(6, 30, 0, 0)),
        end: new Date(baseDate.setHours(12, 30, 0, 0)),
        title: '\u200B',
        observation: 'JORNADA MAÑANA',
        allDay: true,
        backgroundColor: '#ffffff',
        borderColor: '#929292',
        order: 1,
        className: 'jornada-mañana',
      },
      {
        start: new Date(baseDate.setHours(12, 30, 0, 0)),
        end: new Date(baseDate.setHours(18, 30, 0, 0)),
        title: '\u200B',
        observation: 'JORNADA TARDE',
        allDay: true,
        backgroundColor: '#ffffff',
        borderColor: '#929292',
        order: 2,
        className: 'jornada-tarde',
      },
      {
        start: new Date(baseDate.setHours(18, 30, 0, 0)),
        end: new Date(baseDate.setHours(23, 30, 0, 0)),
        title: '\uFEFF',
        observation: 'JORNADA NOCHE',
        allDay: true,
        backgroundColor: '#ffffff',
        borderColor: '#929292',
        order: 3,
        className: 'jornada-noche',
      }
    );
  }

  return events;
}

export function generateMonthEvents(monthYear, eventsCalender, fStart, fEnd) {
  const [year, month] = monthYear.split('-');
  const calendarMonthEvents = eventsCalender?.[month] || [];
  const monthStart = new Date(`${year}-${month}-01`);
  const monthEnd = new Date(year, month, 0);
  const globalStart = new Date(fStart.replace(/\//g, '-'));
  const globalEnd = new Date(fEnd.replace(/\//g, '-'));

  const startRange = monthStart > globalStart ? monthStart : globalStart;
  const endRange = monthEnd < globalEnd ? monthEnd : globalEnd;

  let events = generateDailyEvents(
    startRange.toISOString().split('T')[0],
    endRange.toISOString().split('T')[0]
  );

  const pendingMixtos = [];
  const pendingKeys = new Set();

  events.forEach((a, i) => {
    const dayKey = a.start.toLocaleDateString('sv-SE');

    calendarMonthEvents.forEach((b) => {
      if (dayKey === b.start) {
        const slotStart = a.start.getHours() * 60 + a.start.getMinutes();
        const slotEnd = a.end.getHours() * 60 + a.end.getMinutes();

        if (b.observation === 'JORNADA MIXTA') {
          const startMinutes = parseTimeToMinutes(b.tstart);
          const mixType = startMinutes < 750 ? 'morning-afternoon' : 'afternoon-night';

          if (startMinutes >= slotStart && startMinutes < slotEnd) {
            events[i] = { ...b, order: a.order, mixPart: 1, mixType };
          }

          const mixtoItem = {
            ...b,
            order: a.order + 1,
            start: dayKey,
            mixPart: 2,
            mixType,
          };

          const k = [
            mixtoItem.start,
            mixtoItem.tstart,
            mixtoItem.tend,
            b.fiche ?? b.code ?? b.title ?? '',
          ].join('|');

          if (!pendingKeys.has(k)) {
            pendingMixtos.push(mixtoItem);
            pendingKeys.add(k);
          }
        } else if (b.observation == a.observation) {
          events[i] = { ...b, order: a.order };
        }
      }
    });
  });

  events.forEach((a, i) => {
    const dayKey = new Date(a.start).toLocaleDateString('sv-SE');

    const b = pendingMixtos.find(
      (x) => x.start === dayKey && a.order === x.order
    );

    if (b) {
      events[i] = { ...b, order: a.order };
    }
  });

  events.sort((a, b) => a.order - b.order);
  return events;
}