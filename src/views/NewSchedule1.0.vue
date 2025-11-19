<template>
  <div class="customRow">
    <div id="formHour">
      <div class="row justify-center flex">
        <div class="col-md-11 col-sm-6 col-11">
          <q-card class="my_card full-width q-my-lg" flat>
            <div class="q-pa-md">
              <q-card-section class="card_header q-mb-md">
                <BtnBack route="/schedules" />
                <h5 class="q-mt-sm q-mb-sm text-center text-weight-bold">
                  DILIGENCIA LA INFORMACIÓN
                </h5>
              </q-card-section>

              <q-form
                ref="formCalender"
                @submit.prevent.stop="validateInfo"
                novalidate
              >
                <div>
                  <q-select
                    :label="!isLoadingFiche ? 'Ficha' : 'Cargando...'"
                    v-model="fiche"
                    :options="filterOptionsFiche"
                    :disable="isLoadingFiche || isEdit"
                    dense
                    use-input
                    input-debounce="0"
                    options-dense
                    @filter="filterFiche"
                    @update:model-value="setProgram(fiche)"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.toString().trim().length > 0) ||
                        'El campo es requerido',
                    ]"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined">
                        workspaces
                      </span>
                    </template>
                  </q-select>

                  <q-select
                    type="text"
                    v-model="program"
                    options-dense
                    dense
                    class="q-mb-sm"
                    label="Programa"
                    disable
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined"> list </span>
                    </template>
                  </q-select>

                  <q-select
                    :label="
                      !isLoadingCom || competence
                        ? 'Competencia'
                        : 'Cargando...'
                    "
                    v-model="competence"
                    options-dense
                    dense
                    :disable="isLoadingCom && !competence"
                    :options="filterOptionsComp"
                    use-input
                    input-debounce="0"
                    @filter="filterCompe"
                    @update:model-value="
                      getResults();
                      maybeClearCalendar();
                    "
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.toString().trim().length > 0) ||
                        'El campo es requerido',
                    ]"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined"> checklist </span>
                    </template>
                  </q-select>

                  <q-select
                    :label="
                      !isLoadingRes || result ? 'Resultado' : 'Cargando...'
                    "
                    options-dense
                    dense
                    :disable="isLoadingRes && !result"
                    v-model="result"
                    :options="filterOptionsResult"
                    use-input
                    input-debounce="0"
                    @filter="filterResult"
                    @update:model-value="maybeClearCalendar()"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.toString().trim().length > 0) ||
                        'El campo es requerido',
                    ]"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined">
                        background_dot_large
                      </span>
                    </template>
                  </q-select>

                  <q-select
                    label="Instructor"
                    options-dense
                    dense
                    v-model="instructor"
                    :options="filterOptionsInstru"
                    use-input
                    input-debounce="0"
                    @filter="filterInstru"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.toString().trim().length > 0) ||
                        'El campo es requerido',
                    ]"
                    @update:model-value="
                      getInstructors();
                      maybeClearCalendar();
                    "
                    :disable="isAuto"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined"> person </span>
                    </template>
                  </q-select>

                  <q-input
                    type="text"
                    v-model="supporttext"
                    label="Nota"
                    dense
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.trim().length > 0) ||
                        'El campo es requerido',
                    ]"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined"> edit_note </span>
                    </template>
                  </q-input>

                  <q-input
                    type="text"
                    v-model="observation"
                    label="Observación"
                    dense
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.trim().length > 0) ||
                        'El campo es requerido',
                    ]"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined"> note_alt </span>
                    </template>
                  </q-input>

                  <q-select
                    label="Ambiente"
                    options-dense
                    dense
                    v-model="environment"
                    :options="filterOptionsEnvi"
                    use-input
                    input-debounce="0"
                    @filter="filterEnvir"
                    @update:model-value="
                      getResults();
                      maybeClearCalendar();
                    "
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.toString().trim().length > 0) ||
                        'El campo es requerido',
                    ]"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined">
                        diversity_2
                      </span>
                    </template>
                  </q-select>

                  <div v-if="showDateInputs">
                    <q-input
                      dense
                      v-model="fStart"
                      mask="date"
                      :rules="['date']"
                      lazy-rules
                      label="Fecha Inicio"
                      @update:model-value="maybeClearCalendar()"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="fStart" minimal>
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <template v-slot:prepend>
                        <span class="material-symbols-outlined"> today </span>
                      </template>
                    </q-input>

                    <q-input
                      dense
                      v-model="fEnd"
                      mask="date"
                      label="Fecha Fin"
                      :rules="['date']"
                      lazy-rules
                      @update:model-value="maybeClearCalendar()"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="fEnd" minimal>
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <template v-slot:prepend>
                        <span class="material-symbols-outlined"> event </span>
                      </template>
                    </q-input>
                  </div>

                  <q-input
                    v-model="timeStart"
                    type="time"
                    label="Hora inicio"
                    @update:model-value="maybeClearCalendar('time')"
                    dense
                    lazy-rules
                    :rules="[
                      (val) =>
                        ((val) => val !== null && val !== '') ||
                        'El campo es requerido',
                    ]"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined"> alarm </span>
                    </template>
                  </q-input>

                  <q-input
                    v-model="timeEnd"
                    type="time"
                    label="Hora fin"
                    dense
                    lazy-rules
                    :rules="[
                      (val) =>
                        ((val) => val !== null && val !== '') ||
                        'El campo es requerido',
                    ]"
                    @update:model-value="maybeClearCalendar('time')"
                  >
                    <template v-slot:prepend>
                      <span class="material-symbols-outlined"> timer_off </span>
                    </template>
                  </q-input>

                  <div
                    class="justify-center flex bg-grey-3 q-mb-md"
                    v-if="showWeekdayChecks"
                  >
                    <q-checkbox
                      class="text-black"
                      v-for="(i, index) in days"
                      :key="index"
                      v-model="selectDays"
                      :val="i.value"
                      :label="i.label"
                      @update:model-value="maybeClearCalendar()"
                    />
                  </div>

                  <div class="justify-center flex">
                    <q-btn
                      type="submit"
                      :loading="loadingPrev"
                      :disable="loadingPrev"
                      class="previ q-mt-md q-mb-sm q-mx-sm"
                    >
                      <template v-slot:loading>
                        <q-spinner-oval color="white" size="1em" />
                      </template>
                      <span
                        class="material-symbols-outlined q-mr-sm"
                        style="font-size: 20px"
                      >
                        calendar_month
                      </span>
                      PREVISUALIZAR
                    </q-btn>
                    <q-btn
                      type="button"
                      class="q-mt-md q-mb-sm q-mx-sm button_closed"
                      to="/schedules"
                      v-close-popup
                    >
                      <span
                        class="material-symbols-outlined q-mr-sm"
                        style="font-size: 23px"
                      >
                        cancel
                      </span>
                      CERRAR
                    </q-btn>
                  </div>
                </div>
              </q-form>
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <div id="calenderHour">
      <div class="row justify-center flex">
        <div class="col-11 q-py-lg">
          <FullCalendar
            class="full-width text-uppercase"
            :options="calendarOptions"
          >
            <template v-slot:eventContent="arg">
              <div class="row justify-center flex">
                <template v-if="!tooltipsEnabled || !!arg.event.extendedProps?.autogenerated">
                  <span class="justify-center col-12 items-center">
                    <b>{{ arg.timeText }}</b>
                    <i>{{ arg.event.title }}</i>
                  </span>
                </template>
                <template v-else>
                  <VMenu
                    :autoHide="false"
                    :delay="0"
                    class="justify-center col-9 col-md-10 col-xl-11 items-center customEvents"
                    v-if="arg.event.extendedProps.type == 1"
                  >
                    <span>
                      <b>{{ arg.timeText }}</b>
                      <i>{{ arg.event.title }}</i></span
                    >

                    <template #popper>
                      <div class="content-tooltip-event">
                        <p>INSTRUCTOR: {{ arg.event.title }}</p>
                        <p>
                          ACTIVIDAD: {{ arg.event.extendedProps.typeactivity }}
                        </p>
                        <p>
                          ACTIVIDAD ADICIONAL:
                          {{ arg.event.extendedProps.additionalactivity }}
                        </p>
                        <p>
                          JUSTIFICACIÓN:
                          {{ arg.event.extendedProps.justification }}
                        </p>

                        <p>HORA INICIO: {{ arg.event.extendedProps.tstart }}</p>
                        <p>HORA FIN: {{ arg.event.extendedProps.tend }}</p>
                      </div>
                    </template>
                  </VMenu>

                  <VMenu
                    :autoHide="false"
                    :delay="0"
                    class="justify-center col-9 col-md-10 col-xl-11 items-center customEvents"
                    v-else
                  >
                    <span>
                      <b>{{ arg.timeText }}</b>
                      <i>{{ arg.event.title }}</i></span
                    >

                    <template #popper>
                      <div class="content-tooltip-event">
                        <p>INSTRUCTOR: {{ arg.event.title }}</p>
                        <p>FICHA: {{ arg.event.extendedProps.fiche }}</p>
                        <p>
                          AMBIENTE: {{ arg.event.extendedProps.environment }}
                        </p>
                        <p>PROGRAMA: {{ arg.event.extendedProps.program }}</p>
                        <p>RESULTADO: {{ arg.event.extendedProps.outcome }}</p>
                        <p>NOTA: {{ arg.event.extendedProps.supporttext }}</p>
                        <p>
                          OBSERVACIÓN: {{ arg.event.extendedProps.observation }}
                        </p>
                        <p>HORA INICIO: {{ arg.event.extendedProps.tstart }}</p>
                        <p>HORA FIN: {{ arg.event.extendedProps.tend }}</p>
                      </div>
                    </template>
                  </VMenu>
                </template>

                <div class="col-3 col-md-2 col-xl-1 justify-center flex">
                  <div class="roundedIcon">
                    <q-icon
                      name="close"
                      class="cursor-pointer"
                      color="red"
                      size="17px"
                    />
                  </div>
                </div>
              </div>
            </template>
          </FullCalendar>

          <div class="justify-center flex" v-if="diasProgramados.length > 0">
            <q-btn
              class="q-mt-md q-mb-sm q-mx-sm save_as"
              :loading="loading"
              :disable="loading"
              @click="isEdit ? updateData() : saveData()"
              ><span
                class="material-symbols-outlined q-mr-sm"
                style="font-size: 23px"
              >
                {{ isEdit ? 'edit' : 'save' }}
              </span>
              {{ isEdit ? 'ACTUALIZAR' : 'GUARDAR' }}
              <template v-slot:loading>
                <q-spinner-oval color="white" size="1em" />
              </template>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

//stores
import { storeSche } from '../store/Schedules.js';
import { storeOtherSche } from '../store/OtherSchedules.js';
import { storeComp } from '../store/Competences.js';
import { storeEnv } from '../store/Environments.js';
import { storeInst } from '../store/Instructors.js';
import { storeFiles } from '../store/Files.js';
import { storeResult } from '../store/Results.js';
import { useProgrammingSelectionStore } from '../store/ProgrammingSelection.js';
import BtnBack from '../layouts/btnBackLayout.vue';

function getAutoPayload(route) {
  const from = route?.state?.autoFrom || route?.query?.autoFrom;
  let payload = route?.state?.payload;

  if (!payload && route?.query?.payload) {
    try {
      payload = JSON.parse(decodeURIComponent(route.query.payload));
    } catch (error) {
      console.warn(
        '[NewSchedule] auto mode: payload inválido en query; se ignora.',
        error
      );
      payload = null;
    }
  }

  return { from, payload };
}

const useSchedules = storeSche();
const useOtherSchedules = storeOtherSche();
const useComp = storeComp();
const useEnv = storeEnv();
const useInst = storeInst();
const useFiles = storeFiles();
const useResult = storeResult();
const programmingSelectionStore = useProgrammingSelectionStore();
const $q = useQuasar();

const $router = useRouter();
const route = useRoute();

const { from: initialAutoFrom, payload: initialAutoPayload } =
  getAutoPayload(route);
const autoFrom = ref(initialAutoFrom);
const autoPayload = ref(initialAutoPayload ?? null);

function extractAutoInstructor(info) {
  if (!info || typeof info !== 'object') return null;
  const id =
    info.id ?? info._id ?? info.value ?? info.uuid ?? info.identifier ?? null;
  if (!id) return null;
  const name =
    info.name ?? info.nombre ?? info.label ?? info.title ?? String(id);
  return { id, name };
}

function addDaysToIso(iso, days = 1) {
  const norm = normalizeIsoDate(iso);
  if (!norm) return null;
  // trabajar en local, sin horas, para no pelear con TZ
  const d = new Date(`${norm}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function shiftConsult30Days(list, delta = 1) {
  // ordena y limpia primero, luego vuelve a limpiar por si el shift crea colisiones
  const base = getSortedUniqueDays(list);
  const shifted = base.map((d) => addDaysToIso(d, delta)).filter(Boolean);
  return Array.from(new Set(shifted)).sort((a, b) => a.localeCompare(b));
}

function normalizeIsoDate(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return trimmed;
}

function normalizeValidatedEvents(list) {
  return (list || []).map((ev, i) => {
    const id = ev.id || `val-${i}-${ymdFromAny(ev.start) || ''}`;
    const extendedProps = { ...(ev.extendedProps || {}), autogenerated: false };
    // Back suele mandar bien allDay; garantizamos que previews finales no sean "autogeneradas"
    return { ...ev, id, extendedProps };
  });
}

function getSortedUniqueDays(list) {
  if (!Array.isArray(list)) return [];
  const unique = new Set();
  list.forEach((value) => {
    const normalized = normalizeIsoDate(value);
    if (normalized) {
      unique.add(normalized);
    }
  });
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

function parseIsoDate(iso) {
  const normalized = normalizeIsoDate(iso);
  if (!normalized) return null;
  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function computeDayNumbers(days) {
  if (!Array.isArray(days)) return [];
  return Array.from(
    new Set(
      days
        .map((iso) => {
          const parsed = parseIsoDate(iso);
          return parsed !== null ? parsed.getDay() : null;
        })
        .filter((day) => day !== null)
    )
  );
}

const hasAutoPayload = computed(() => {
  const payload = autoPayload.value;
  if (!payload) return false;
  const instructorInfo = extractAutoInstructor(payload.instructor);
  const days = getSortedUniqueDays(payload.diasProgramar);
  return !!(instructorInfo && days.length);
});

const showWeekdayChecks = computed(() => !isAuto.value);

const isAuto = computed(
  () => autoFrom.value === 'consult30' && hasAutoPayload.value
);

const explicitDates = ref([]);
const showDateInputs = computed(
  () => !(isAuto.value && explicitDates.value.length > 0)
);
const disableWeekdayChecks = computed(
  () => isAuto.value && explicitDates.value.length > 0
);

const selectedDaysForApi = computed(() =>
  isAuto.value && explicitDates.value.length
    ? computeDayNumbers(explicitDates.value)
    : selectDays.value
);

let formCalender = ref();
let fiche = ref('');
let program = ref('');
let competence = ref();
let result = ref();
let instructor = ref();
let supporttext = ref();
let observation = ref();
let environment = ref();
let fStart = ref();
let fEnd = ref();
let timeStart = ref();
let timeEnd = ref();
let selectDays = ref([]);
let optionsFiches = ref([]);
let optionsCompetences = ref([]);
let optionsResult = ref([]);
let optionsInstructors = ref([]);
let optionsEnvironment = ref([]);
let diasProgramados = ref([]);
let isEdit = ref(false);
let isLoadingFiche = ref(true);
let isLoadingCom = ref(true);
let isLoadingRes = ref(true);
let idSchedule = ref(null);
let filterOptionsFiche = ref([]);
let filterOptionsInstru = ref([]);
let filterOptionsComp = ref([]);
let filterOptionsEnvi = ref([]);
let filterOptionsResult = ref([]);
let loading = ref(false);
let loadingPrev = ref(false);
let tooltipsEnabled = ref(false); // al entrar desde consult3.0: sin tooltips

onMounted(() => {
  if (programmingSelectionStore.selection) {
    console.log(
      'Selección de programación recibida en NewSchedule:',
      programmingSelectionStore.selection
    );
  }

  if (autoFrom.value === 'consult30' && !hasAutoPayload.value) {
    console.warn(
      '[NewSchedule] auto mode: payload incompleto; usando modo normal.'
    );
  }

  if (isAuto.value && !isEdit.value) {
    applyAutoMode();
  }
});

onBeforeMount(async () => {
  //capturar el params de la url
  idSchedule.value = $router.currentRoute.value.params.id;
  if (idSchedule.value) {
    isEdit.value = true;
    const { data } = await useSchedules.getScheduleById(idSchedule.value);

    fiche.value = {
      label: `${data.fiche.number} - ${data.program.name}`,
      value: data.fiche,
    };

    program.value = {
      label: `${data.program.code} - ${data.program.name}`,
      value: data.program._id,
    };

    competence.value = {
      label: `${data.competence.number} - ${data.competence.name}`,
      value: data.competence._id,
    };

    result.value = {
      label: `${data.outcome.code} - ${data.outcome.outcomes}`,
      value: data.outcome._id,
    };

    instructor.value = {
      label: data.instructor.name,
      value: data.instructor._id,
    };

    environment.value = {
      label: data.environment.name,
      value: data.environment._id,
    };

    supporttext.value = data.supporttext;
    observation.value = data.observation;

    days.value = [
      { label: 'Lunes', value: 1 },
      { label: 'Martes', value: 2 },
      { label: 'Miércoles', value: 3 },
      { label: 'Jueves', value: 4 },
      { label: 'Viernes', value: 5 },
      { label: 'Sábado', value: 6 },
      { label: 'Domingo', value: 0 },
    ];

    selectDays.value = data.days;

    fStart.value = data.fstart;
    fEnd.value = data.fend;
    timeStart.value = data.tstart;
    timeEnd.value = data.tend;

    //timeout para que se cargue el calendario y se pueda mostrar los dias programados
    setTimeout(() => {
      diasProgramados.value = data.events;
      calendarOptions.value.events = diasProgramados.value;
    }, 100);
    await getCompetence();
    await getResults();
  }

  await getFiches();
  await getInstructors();
  await getEnvironments();
});
let days = ref([
  { label: 'Lunes', value: 1 },
  { label: 'Martes', value: 2 },
  { label: 'Miércoles', value: 3 },
  { label: 'Jueves', value: 4 },
  { label: 'Viernes', value: 5 },
  { label: 'Sábado', value: 6 },
  { label: 'Domingo', value: 0 },
]);

// CALENDAR
let calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locale: esLocale,
  timeZone: 'America/Bogota',
  initialView: 'dayGridMonth',
  selectable: true,
  eventClick: handleEventClick,
  headerToolbar: {
    right: 'prev,next today',
    center: '',
    left: 'title',
  },
  droppable: true,
  events: [],
});

const isFromConsult30 = computed(() => autoFrom.value === 'consult30');

function toLocalIso(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:00`;
}

function fixUTCShift(list) {
  return (Array.isArray(list) ? list : []).map((e) => {
    const ev = { ...e };

    if (ev.allDay === true) {
      if (typeof ev.start === 'string') ev.start = ev.start.slice(0, 10); // YYYY-MM-DD
      if ('end' in ev) delete ev.end; // end fuera para all-day
      return ev;
    }

    for (const k of ['start', 'end']) {
      const v = ev[k];
      if (typeof v === 'string' && v.endsWith('Z')) {
        const d = new Date(v); // interpreta UTC
        ev[k] = toLocalIso(d); // ISO local, SIN Z
      }
    }
    return ev;
  });
}

function handleEventClick(clickInfo) {
  if (
    instructor.value.value !== clickInfo.event.extendedProps.idInstructor ||
    clickInfo.event.extendedProps.autogenerated == false
  ) {
    $q.dialog({
      title: 'Confirm',
      message: 'Esta seguro que desea eliminar el evento?',
      cancel: true,
      persistent: true,
    })
      .onOk(async () => {
        clickInfo.event.remove();

        let indexEvent = diasProgramados.value.findIndex((value) => {
          return value.id == clickInfo.event.id;
        });

        if (clickInfo.event.extendedProps.type == 1) {
          await useOtherSchedules
            .deleteEvent(
              clickInfo.event.extendedProps.code,
              clickInfo.event.start.toISOString().split('T')[0]
            )
            .then((res) => {
              diasProgramados.value.splice(indexEvent, 1);
            });
        } else {
          await useSchedules
            .deleteEvent(
              clickInfo.event.extendedProps.code,
              clickInfo.event.start.toISOString().split('T')[0]
            )
            .then((res) => {
              diasProgramados.value.splice(indexEvent, 1);
            });
        }
      })
      .onCancel(() => {})
      .onDismiss(() => {});
  } else {
    clickInfo.event.remove();
    let indexEvent = diasProgramados.value.findIndex((value) => {
      return value.id == clickInfo.event.id;
    });

    diasProgramados.value.splice(indexEvent, 1);
  }
}

function setDiasEnCalendario(diasISO = [], instructorInfo) {
  if (!Array.isArray(diasISO) || !calendarOptions.value) {
    return;
  }

  const events = diasISO.map((date, index) => ({
    id: `auto-${date}-${index}`,
    title: instructorInfo?.name || 'Programación',
    start: date,
    end: date,
    allDay: true,
    extendedProps: {
      autogenerated: true,
      idInstructor: instructorInfo?.id ?? null,
      instructor: instructorInfo?.name || '',
      tstart: timeStart.value ?? null,
      tend: timeEnd.value ?? null,
      type: 0,
    },
  }));

  diasProgramados.value = events;
  calendarOptions.value.events = [...events];

  if (diasISO.length) {
    calendarOptions.value.initialDate = diasISO[0];
  }
}

function buildPreviewFromExplicitDates(dates, tStart, tEnd, instr) {
  const toISO = (d, t) => `${d}T${t}:00`;
  return dates.map((d, i) => ({
    id: `pv-${d}-${i}`,
    title: instr?.label || 'Sesión',
    start: toISO(d, tStart),
    end: toISO(d, tEnd),
    allDay: false,
    extendedProps: {
      autogenerated: true,
      idInstructor: instr?.value ?? null,
      instructor: instr?.label || '',
      tstart: tStart,
      tend: tEnd,
      type: 0,
    },
  }));
}

function ymdFromAny(v) {
  if (!v) return null;
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, '0');
    const d = String(v.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const s = String(v);
  // YYYY-MM-DDTHH:mm...
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return null;
}

function filterEventsByExplicitDates(events, explicit) {
  const keep = new Set((explicit || []).map((d) => d.trim()));
  return (events || []).filter((ev) => keep.has(ymdFromAny(ev.start)));
}

function applyAutoMode() {
  if (!hasAutoPayload.value || isEdit.value) {
    return;
  }

  const payload = autoPayload.value || {};
  const instructorInfo = extractAutoInstructor(payload.instructor);
  let days = getSortedUniqueDays(payload.diasProgramar);

  if (isFromConsult30.value) {
    days = shiftConsult30Days(days, 1);
  }

  if (instructorInfo) {
    instructor.value = {
      label: instructorInfo.name,
      value: instructorInfo.id,
    };
  }

  if (!days.length) {
    return;
  }

  fStart.value = days[0];
  fEnd.value = days[days.length - 1];
  selectDays.value = computeDayNumbers(days);
  timeStart.value =
    typeof payload.timeStart === 'string' ? payload.timeStart : null;
  timeEnd.value = typeof payload.timeEnd === 'string' ? payload.timeEnd : null;

  explicitDates.value = days;
  diasProgramados.value = [];
  calendarOptions.value.events = [];
  calendarOptions.value.initialDate = days[0];

  setDiasEnCalendario(days, instructorInfo); // ya lo tienes implementado
  tooltipsEnabled.value = false; // tooltips apagados en esta fase
}

// -------------------- codigo principal --------------------
async function validateInfo() {
  loadingPrev.value = true;

  const instr = instructor.value;
  const tStart = timeStart.value;
  const tEnd = timeEnd.value;

  if (!instr || !instr.value || !tStart || !tEnd) {
    loadingPrev.value = false;
    return;
  }

  const data = {
    fiche: fiche.value?.value?._id,
    instructor: instr.value,
    tstart: tStart,
    tend: tEnd,
    days: selectDays.value, // días de la semana
    environment: environment.value?.value,
    program: program.value?.value,
    outcome: result.value?.value,
    competence: competence.value?.value,
    fstart:
      isAuto.value && explicitDates.value.length
        ? explicitDates.value[0]
        : fStart.value,
    fend:
      isAuto.value && explicitDates.value.length
        ? explicitDates.value[explicitDates.value.length - 1]
        : fEnd.value,
  };

  try {
    const call = idSchedule.value
      ? useSchedules.validateEditSchedule(idSchedule.value, data)
      : useSchedules.validateSchedule(data);

    const res = await call;
    if (res && res.data && res.status < 201) {
      let raw = res.data.events || [];
      raw = isFromConsult30.value ? fixUTCShift(raw) : raw;

      // Si veniste de consult3.0 y mandaste fechas explícitas,
      // quédate solo con esas fechas
      let finalEvents = raw;
      if (isAuto.value && explicitDates.value.length) {
        finalEvents = filterEventsByExplicitDates(raw, explicitDates.value);
      }

      finalEvents = normalizeValidatedEvents(finalEvents);

      diasProgramados.value = finalEvents;
      calendarOptions.value.events = [...finalEvents];
      if (finalEvents.length) {
        const first = ymdFromAny(finalEvents[0].start);
        if (first) calendarOptions.value.initialDate = first;
      }

      tooltipsEnabled.value = true;
    }
  } finally {
    loadingPrev.value = false;
  }
}

function setProgram(info) {
  program.value = {
    label: `${info.value.program.code} - ${info.value.program.name}`,
    value: info.value.program._id,
  };
  getCompetence();
}

async function getCompetence() {
  optionsCompetences.value = [];
  isLoadingCom.value = true;
  const { data } = await useComp.getCompetencesByProgram(program.value.value);
  data.forEach((row, index) => {
    optionsCompetences.value.push({
      label: `${row.number} - ${row.name}`,
      value: row._id,
    });
    filterOptionsComp.value = optionsCompetences.value;
  });
  isLoadingCom.value = false;
}

async function getResults() {
  optionsResult.value = [];
  isLoadingRes.value = true;
  const { data } = await useResult.getResultsByCompetence(
    competence.value.value
  );

  data[0].outcomes.forEach((row, index) => {
    optionsResult.value.push({
      label: `${row.code} - ${row.outcomes}`,
      value: row._id,
    });
    filterOptionsResult.value = optionsResult.value;
  });
  isLoadingRes.value = false;
}

async function getFiches() {
  optionsFiches.value = [];
  isLoadingFiche.value = true;
  const res = await useFiles.getFilesActive();
  res.data.forEach((row, index) => {
    optionsFiches.value.push({
      label: `${row.number} - ${row.program.name}`,
      value: row,
    });
    filterOptionsFiche.value = optionsFiches.value;
  });
  isLoadingFiche.value = false;
}

async function getInstructors() {
  optionsInstructors.value = [];
  const res = await useInst.getInstructorActive();
  res.forEach((row, index) => {
    optionsInstructors.value.push({ label: row.name, value: row._id });
    filterOptionsInstru.value = optionsInstructors.value;
  });
}

async function getEnvironments() {
  optionsEnvironment.value = [];
  const res = await useEnv.getEnvActive();
  res.forEach((row, index) => {
    optionsEnvironment.value.push({ label: row.name, value: row._id });
    filterOptionsEnvi.value = optionsEnvironment.value;
  });
}

function clearFields() {
  fiche.value = null;
  program.value = null;
  competence.value = null;
  result.value = null;
  instructor.value = null;
  supporttext.value = null;
  observation.value = null;
  environment.value = null;
  fStart.value = null;
  fEnd.value = null;
  timeStart.value = null;
  timeEnd.value = null;

  calendarOptions.value.events = [];
  diasProgramados.value = [];
  selectDays.value = [];
  formCalender.value.resetValidation();
  loading.value = false;
}

async function saveData() {
  loading.value = true;

  let dataShedule = {
    fiche: fiche.value.value._id,
    program: program.value.value,
    competence: competence.value.value,
    outcome: result.value.value,
    instructor: instructor.value.value,
    supporttext: supporttext.value,
    observation: observation.value,
    environment: environment.value.value,
    days: selectedDaysForApi.value,
    fstart:
      isAuto.value && explicitDates.value.length
        ? explicitDates.value[0]
        : fStart.value,
    fend:
      isAuto.value && explicitDates.value.length
        ? explicitDates.value[explicitDates.value.length - 1]
        : fEnd.value,
    tstart: timeStart.value,
    tend: timeEnd.value,
  };

  dataShedule.events = diasProgramados.value;

  await useSchedules.postSchedules(dataShedule).then((res) => {
    if (res.status <= 201) {
      clearFields();
    }
  });
  loading.value = false;
}

async function updateData() {
  loading.value = true;

  let dataSchedule = {
    fiche: fiche.value.value._id,
    competence: competence.value.value,
    outcome: result.value.value,
    supporttext: supporttext.value,
    observation: observation.value,
    instructor: instructor.value.value,
    environment: environment.value.value,
    days: selectedDaysForApi.value,
    fstart:
      isAuto.value && explicitDates.value.length
        ? explicitDates.value[0]
        : fStart.value,
    fend:
      isAuto.value && explicitDates.value.length
        ? explicitDates.value[explicitDates.value.length - 1]
        : fEnd.value,
    tstart: timeStart.value,
    tend: timeEnd.value,
  };

  dataSchedule.events = diasProgramados.value;

  await useSchedules
    .putSchedules(idSchedule.value, dataSchedule)
    .then((res) => {
      if (res.status <= 201) {
        loading.value = false;
        clearFields();
        //volver atrás
        $router.back();
      }
    });

  loading.value = false;
}

function maybeClearCalendar(trigger = '') {
  // Si venimos de consult3.0 y aún estamos en fase "mudita" (sin tooltips),
  // NO limpies la previsualización. Opcional: actualiza horas en caliente.
  if (isAuto.value && explicitDates.value.length && !tooltipsEnabled.value) {
    if (trigger === 'time') {
      diasProgramados.value = (diasProgramados.value || []).map(ev => ({
        ...ev,
        extendedProps: {
          ...(ev.extendedProps || {}),
          tstart: timeStart.value ?? ev.extendedProps?.tstart ?? null,
          tend:   timeEnd.value   ?? ev.extendedProps?.tend   ?? null
        }
      }));
      calendarOptions.value.events = [...diasProgramados.value];
    }
    return; // no limpies nada en fase previa
  }

  // Modo normal o ya con tooltips: puedes limpiar
  calendarOptions.value.events = [];
  diasProgramados.value = [];
}

function filterFiche(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase();

    filterOptionsFiche.value = optionsFiches.value.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

function filterInstru(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase();
    filterOptionsInstru.value = optionsInstructors.value.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

function filterCompe(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase();
    filterOptionsComp.value = optionsCompetences.value.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

function filterEnvir(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase();

    filterOptionsEnvi.value = optionsEnvironment.value.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

function filterResult(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase();

    filterOptionsResult.value = optionsResult.value.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<style>
.roundedIcon {
  background-color: white;
  border-radius: 50%;
}

.save_as {
  background-color: var(--color_button) !important;
  color: var(--color_text_button) !important;
}

.previ {
  background-color: var(--color_button) !important;
  color: var(--color_text_button) !important;
}

.customRow {
  display: grid;
  grid-template-columns: repeat(2, 30% 70%);
}

@media screen and (max-width: 1200px) {
  .customRow {
    display: grid;
    grid-template-columns: auto;
  }
}

.card_header {
  background-color: var(--color_card);
  color: var(--color_text_card);
}
.my-tooltip {
  background-color: var(--color_tooltip);
}
.fc .fc-deleteEvent-button {
  background: url(/icon/delete1.png) no-repeat center center;
  background-size: 25px;
  border-color: rgb(42, 60, 80);
  border-radius: 50%;
  margin-left: 2px;
  width: 45px;
  height: 45px;
  position: relative;
}
.fc .fc-deleteEvent-button:hover {
  background: url(/icon/delete2.png) no-repeat center center;
  background-color: rgb(42, 60, 80);
}

.fc .fc-deleteEvent-button::after {
  /* insertar el texto e icono */
  background: url(/icon/delete1.png) no-repeat center center;
  font-size: 14px;
}

.fc .fc-deleteEvent-button:hover::after {
  content: 'Arrastra un evento';
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px;
  border-radius: 3px;
  font-size: 12px;
  white-space: nowrap;
  animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
