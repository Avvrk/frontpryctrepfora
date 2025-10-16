<template>
  <div>
    <BtnBack
      :route="
        role !== 'USER'
          ? '/reports'
          : opcion == 'instructor'
          ? '/home/instructor'
          : '/consultor'
      "
    />

    <HeaderLayout title="Reportes" />
    <q-form @submit.prevent.stop="getReport()" novalidate v-if="!existInfo">
      <div class="row justify-center column q-mx-xl">
        <div class="q-gutter-sm">
          <q-radio v-model="shape" val="instructor" label="Por Instructor" />
          <q-radio v-model="shape" val="area" label="Por Area" />
        </div>
        <div class="col-11 col-sm-6 q-px-md">
          <q-select
            filled
            type="text"
            v-model="knowledge"
            label="Red de conocimiento"
            options-dense=""
            :options="optionsKnowledge"
            :option-label="(row) => row.red"
            :option-value="(row) => row"
            use-input
            lazy-rules
            :rules="[
              (val) =>
                (val && val.toString().trim().length > 0) ||
                'El campo es requerido',
            ]"
            @update:model-value="thematicarea = null"
            @filter="filterKnowledge"
            :popup-content-style="{ width: '300px' }"
          >
            <template v-slot:prepend>
              <span class="material-symbols-outlined"> category </span>
            </template>
            <template v-slot:append>
              <q-icon
                v-if="knowledge"
                class="cursor-pointer"
                name="clear"
                @click.stop.prevent="knowledge = null"
              />
            </template>
          </q-select>
          <q-select
            filled
            type="text"
            v-model="thematicarea"
            label="Área temática"
            options-dense=""
            :options="optionsThematicarea"
            :disable="!knowledge"
            use-input
            lazy-rules
            :rules="[
              (val) =>
                (val && val.toString().trim().length > 0) ||
                'El campo es requerido',
            ]"
            @update:model-value="handleThematicareaChange"
            @filter="filterThematicarea"
            :popup-content-style="{ width: '300px' }"
          >
            <template v-slot:prepend>
              <span class="material-symbols-outlined"> category </span>
            </template>
            <template v-slot:append>
              <q-icon
                v-if="thematicarea"
                class="cursor-pointer"
                name="clear"
                @click.stop.prevent="thematicarea = null"
              />
            </template>
          </q-select>
          <q-select
            v-if="shape == 'instructor'"
            filled
            :disable="!thematicarea || !knowledge"
            v-model="inst"
            label="Instructor"
            use-input
            hide-selected
            options-dense
            fill-input
            input-debounce="0"
            :options="filterInstructor"
            @filter="filterInstru"
            lazy-rules
            :rules="[(val) => !!val || 'El campo es requerido']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
            <template v-slot:prepend>
              <span class="material-symbols-outlined"> person </span>
            </template>
          </q-select>
        </div>

        <div class="col-11 col-sm-6 q-px-md">
          <q-input
            filled
            placeholder="aaaa/mm/dd"
            v-model="fStart"
            mask="date"
            label="Fecha inicio"
            :rules="['date']"
            lazy-rules
            @update:model-value="clearDataCalender()"
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
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            placeholder="aaaa/mm/dd"
            v-model="fEnd"
            mask="date"
            label="Fecha Fin"
            :rules="['date']"
            lazy-rules
            @update:model-value="clearDataCalender()"
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
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="flex justify-center q-mt-sm">
            <q-btn
              :loading="loadingData"
              type="submit"
              class="bg-green-9 text-white"
            >
              REPORTE
              <template v-slot:loading>
                <q-spinner-oval color="white" size="1em" />
              </template>
            </q-btn>
          </div>
        </div>
      </div>
    </q-form>

    <div class="row justify-center" v-if="existInfo">
  <div class="col-11">
    <div class="actions-bar">
      <q-btn
        v-if="shape === 'area' && existInfo"
        label="Programar"
        color="primary"
        class="bg-green-7 text-white"
        :outline="!programmingMode"
        :unelevated="programmingMode"
        :disable="legendInstructors.length === 0"
        @click="toggleProgrammingMode"
      />
      <q-btn
        v-if="shape === 'area' && existInfo"
        label="Ver selección"
        color="secondary"
        class="bg-green-7 text-white"
        :disable="!programmingSelections.length"
        @click="logProgrammingSelection"
      />
      <q-btn
        v-if="shape === 'instructor' && existInfo"
        label="Generar PDF"
        icon="print"
        class="bg-green-7 text-white"
        @click="exportCalender()"
      />
      <q-btn
        v-if="shape === 'instructor' && existInfo"
        label="Generar excel"
        icon="print"
        class="bg-green-9 text-white"
        @click="saveExcel()"
      />
      <q-btn
        label="Cancelar"
        icon="cancel"
        class="bg-red-5 text-white"
        @click="cancel()"
      />
    </div>
  </div>
</div>

    <div id="calenderPrint">
      <div class="row justify-center flex">
        <div
          class="col-9 q-mb-md q-mt-sm"
          v-if="shape === 'instructor' && existInfo"
        >
          <span class="text-h6" v-if="opcion == 'instructor' && existInfo">
            <span class="text-weight-bold"> INSTRUCTOR: </span
            >{{ nameInstructor.toUpperCase() }}
            <br />
            <span class="text-weight-bold"> HORAS DE FORMACIÓN: </span
            >{{ Math.ceil(hoursWork1) }} HORAS
            <br />
            <span class="text-weight-bold"> HORAS DE OTRAS ACTIVIDADES: </span
            >{{ Math.ceil(hoursWork2) }} HORAS
            <br />
            <span class="text-weight-bold"> TOTAL DE HORAS: </span
            >{{ Math.ceil(hoursWork1 + hoursWork2) }} HORAS
          </span>
          <span class="text-h6" v-if="opcion == 'ficha' && existInfo">
            <span class="text-weight-bold"> FICHA: </span
            >{{ dataFiche.toUpperCase() }}
          </span>
          <span class="text-h6" v-if="opcion == 'ambiente' && existInfo">
            <span class="text-weight-bold"> AMBIENTE: </span
            >{{ nameEnvironment.toUpperCase() }}
          </span>
        </div>
      </div>
      <div class="legend-wrapper" :class="{ 'is-programming': programmingMode }" v-if="shape === 'area' && existInfo">
  <div class="legend-toolbar">
    <q-input
      v-model="legendQuery"
      type="search"
      dense
      debounce="150"
      clearable
      placeholder="Filtrar instructores..."
      class="legend-search"
      :clear-value="''"
      @keyup.esc="legendQuery = ''"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-space />
    <q-toggle v-model="denseLegend" label="Compacto" dense />
  </div>

  <div class="legend-grid">
    <label
      v-for="p in filteredLegend"
      :key="p.id"
      class="legend-chip"
      :class="{
        'is-selected': programmingMode && selectedInstructorId === p.id,
        'is-compact': denseLegend
      }"
      :style="{ '--chip-color': p.color }"
    >
      <input
        v-if="programmingMode"
        class="legend-chip__radio"
        type="radio"
        :value="p.id"
        v-model="selectedInstructorId"
        aria-label="Seleccionar instructor"
      />
      <span class="legend-chip__swatch" aria-hidden="true"></span>
      <span class="legend-chip__name q-truncate">{{ p.name }}</span>
      <span v-if="typeof p._count === 'number'" class="legend-chip__count" title="Eventos en rango">
        {{ p._count }}
      </span>
    </label>
  </div>
</div>
      <div
        class="time-legend q-ml-xl q-pt-xl column"
        style="position: fixed; left: 0; bottom: 10%"
        v-if="opcion == 'instructor' && existInfo"
      >
        <!-- Mañana -->
        <div class="legend-item morning">
          <span class="legend-color" aria-label="Mañana"></span>
          <span class="legend-text">Mañana</span>
          <q-tooltip anchor="top left" self="center left" :offset="[25, 20]">
            {{ shiftRanges.morning }}
          </q-tooltip>
        </div>

        <!-- Tarde -->
        <div class="legend-item afternoon">
          <span class="legend-color" aria-label="Tarde"></span>
          <span class="legend-text">Tarde</span>
          <q-tooltip anchor="top left" self="center left" :offset="[25, 20]">
            {{ shiftRanges.afternoon }}
          </q-tooltip>
        </div>

        <!-- Noche -->
        <div class="legend-item night">
          <span class="legend-color" aria-label="Noche"></span>
          <span class="legend-text">Noche</span>
          <q-tooltip anchor="top left" self="center left" :offset="[25, 20]">
            {{ shiftRanges.night }}
          </q-tooltip>
        </div>

        <!-- MIXTA -->
        <div class="legend-item mixta" v-if="shape != 'area'">
          <span class="legend-color" aria-label="Noche"></span>
          <span class="legend-text">Mixta</span>
          <!--           <q-tooltip anchor="top left" self="center left" :offset="[25, 20]">
            {{ shiftRanges.mixta }}
          </q-tooltip> -->
        </div>
      </div>
      <div id="calenderHour" v-for="(c, i) in calendarOptions" :key="i">
        <div
          class="row justify-center hoursmonth"
          v-if="existInfo && Math.ceil(monthHours[yearsMonth[i]] || 0) > 0"
        >
          <div>
            HORAS DEL MES:
            {{ Math.ceil(monthHours[yearsMonth[i]] || 0) }} HORAS
          </div>
        </div>
        <div class="row justify-center flex" v-if="existInfo && showCalender">
          <div class="col-10 q-pb-lg q-mt-md justify-center flex">
            <div class="calendar-scroll">
            <FullCalendar class="calender text-uppercase" :options="c">
              <template v-if="shape === 'area'" v-slot:eventContent="arg">
                <div class="area-event">
                  <div
                    v-if="arg.event.extendedProps.areaItems.length"
                    class="area-event__dots"
                  >
                    <VMenu
  v-for="slot in arg.event.extendedProps.areaItems"
  :key="tooltipEpoch + '-' + slot.slotKey"
  :triggers="['hover','focus']"
  :popper-triggers="['hover','mouseleave','blur']"
  :auto-hide="true"
  :interactive="true"
  :delay="{ show: 120, hide: 100 }"
  strategy="fixed"
  :distance="8"
  placement="top"
  :teleport="'body'"
  :close-on-content-click="false"
  :dispose-timeout="0"
  :shown="openTooltipId === slot.slotKey"
  @apply-show="openTooltipId = slot.slotKey"
  @apply-hide="openTooltipId = (openTooltipId === slot.slotKey ? null : openTooltipId)"
  class="area-event__menu"
>
                    
                      <span
                        class="area-event__dot"
                        :style="{ backgroundColor: slot.color }"
                      >{{ slot.instructor.charAt(0).toUpperCase() }}</span>

                      <template #popper>
                        <div class="content-tooltip-event1">
                          <p>
                            INSTRUCTOR:
                            {{
                              getAreaTooltipText(
                                slot.instructor,
                                'Sin instructor'
                              )
                            }}
                          </p>
                          <p>
                            FICHA:
                            {{ getAreaTooltipText(slot.fiche, 'Sin ficha') }}
                          </p>
                          <p>
                            AMBIENTE:
                            {{
                              getAreaTooltipText(
                                slot.environment,
                                'Sin ambiente'
                              )
                            }}
                          </p>
                        </div>
                      </template>
                    </VMenu>
                  </div>
                </div>
              </template>
              <template
                v-else-if="opcion == 'instructor'"
                v-slot:eventContent="arg"
              >

                <VMenu
  :key="tooltipEpoch + '-' + (arg?.event?.id || arg?.event?.startStr || arg?.event?.title)"
  :triggers="['hover','focus']"
  :popper-triggers="['hover','mouseleave','blur']"
  :auto-hide="true"
  :interactive="true"
  :delay="{ show: 120, hide: 100 }"
  strategy="fixed"
  :distance="8"
  placement="top"
  :teleport="'body'"
  :close-on-content-click="false"
  :dispose-timeout="0"
  :shown="openTooltipId === (arg?.event?.id || arg?.event?.startStr || arg?.event?.title)"
  @apply-show="openTooltipId = (arg?.event?.id || arg?.event?.startStr || arg?.event?.title)"
  @apply-hide="openTooltipId = (openTooltipId === (arg?.event?.id || arg?.event?.startStr || arg?.event?.title) ? null : openTooltipId)"
  class="justify-center items-center customEvents"
>
                  <span>
                    <b>{{ arg.timeText }}</b>
                    <i>{{ arg.event.title }}</i></span
                  >

                  <template #popper>
                    <div class="content-tooltip-event">
                      <p>FICHA: {{ arg.event.title }}</p>
                      <p>AMBIENTE: {{ arg.event.extendedProps.environment }}</p>
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
            </FullCalendar>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { storeFiles } from '../store/Files.js';
import { storeInst } from '../store/Instructors.js';
import { storeReport } from '../store/Reports.js';
import { useQuasar } from 'quasar';
import { jsPDF } from 'jspdf';
import { useRouter } from 'vue-router';
import dataRedConocimiento from '../static/dataRedConocimiento.js';

import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import { storeUser } from '../store/users.js';
import { storeEnv } from '../store/Environments.js';
import { excelToReports } from '../services/excelToReports.js';

import BtnBack from '../layouts/btnBackLayout.vue';
import HeaderLayout from '../layouts/headerViewsLayout.vue';

const $q = useQuasar();

const shape = ref('instructor');

const useFiches = storeFiles();
const useInstructors = storeInst();
const useEnvir = storeEnv();
// is role USER
const useUser = storeUser();
const role = ref(useUser.getRole());

const shiftRanges = {
  morning: '6:30 AM - 12:30 PM',
  afternoon: '12:30 PM - 6:30 PM',
  night: '6:30 PM - 11:30 PM',
};

const COLOR_PALETTE = [
  '#F94144',
  '#F3722C',
  '#F8961E',
  '#F9844A',
  '#F9C74F',
  '#90BE6D',
  '#43AA8B',
  '#577590',
  '#277DA1',
  '#4D908E',
  '#B5838D',
  '#6D597A',
  '#FF6B6B',
  '#FFD166',
  '#06D6A0',
  '#118AB2',
  '#073B4C',
  '#8338EC',
  '#FB5607',
  '#FFBE0B',
  '#3A86FF',
  '#FF006E',
  '#2A9D8F',
  '#E9C46A',
  '#F4A261',
  '#E76F51',
  '#9E0059',
  '#4CC9F0',
  '#4361EE',
  '#480CA8',
];

let availableColors = [...COLOR_PALETTE];

const resetAvailableColors = () => {
  availableColors = [...COLOR_PALETTE];
};

const SHIFT_CLASS_TO_KEY = {
  'jornada-mañana': 'morning',
  'jornada-tarde': 'afternoon',
  'jornada-noche': 'night',
};

const SHIFT_OBSERVATION_TO_KEY = {
  'jornada mañana': 'morning',
  'jornada tarde': 'afternoon',
  'jornada noche': 'night',
};

let legendInstructors = ref([]); // contiene los instructores con sus colores para el legend
let fiche = ref();
let inst = ref();
let thematicarea = ref();
let knowledge = ref();
let environment = ref();
let fStart = ref();
let fEnd = ref();
let optionsFiches = ref([]);
let optionsInst = ref([]);
let optionsEnvir = ref([]);
let months = ref([]);
let yearsMonth = ref([]);
let eventsCalender = ref({});
let calendarOptions = ref([]);
let existInfo = ref(false);
let monthHours = ref({});
let nameInstructor = ref('');
let dataFiche = ref('');
let nameEnvironment = ref('');
let hoursWork1 = ref(0);
let hoursWork2 = ref(0);
let showCalender = ref(true);
let isLoading = ref(false);
let isLoadingData = ref(false);
let opcion = ref('');
let filterFiche = ref([]);
let filterInstructor = ref([]);
let filterEnvironment = ref([]);
let loadingData = ref(false);
let print = ref(false);
let optionsKnowledge = ref([...dataRedConocimiento]);
let optionsThematicarea = ref([]);
let copyFilterInst = ref([]);
let programmingMode = ref(false);
let selectedInstructorId = ref(null);
const programmingSelections = ref([]);

const legendQuery = ref('');    // deja string por defecto, no null
const denseLegend = ref(false);

// cuál tooltip está abierto ahora mismo
const openTooltipId = ref(null);

// cierra todos al cambiar de tamaño/orientación (ya tenías epoch; esto convive)
const tooltipEpoch = ref(0);
const forceCloseTooltips = () => { 
  openTooltipId.value = null; 
  tooltipEpoch.value++; 
};

onMounted(() => {
  window.addEventListener('resize', forceCloseTooltips, { passive: true });
  window.addEventListener('orientationchange', forceCloseTooltips, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', forceCloseTooltips);
  window.removeEventListener('orientationchange', forceCloseTooltips);
});

const sanitize = (s) =>
  String(s ?? '')
    .normalize('NFD')                       // quita acentos
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const filteredLegend = computed(() => {
  const q = sanitize(legendQuery.value);
  const base = Array.isArray(legendInstructors.value) ? legendInstructors.value : [];
  if (!q) return base;                      // vacío => muestra todos
  return base.filter(p => sanitize(p.name).includes(q));
});

function totalEventsByMonthMap(monthMap) {
  if (!monthMap || typeof monthMap !== 'object') return 0;
  let total = 0;
  for (const v of Object.values(monthMap)) {
    if (Array.isArray(v)) total += v.length;
  }
  return total;
}

const getAreaTooltipText = (value, fallback) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : fallback;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'object') {
    const candidates = [
      value?.name,
      value?.label,
      value?.code,
      value?.number,
      value?.title,
    ];

    for (const candidate of candidates) {
      if (candidate === null || candidate === undefined) {
        continue;
      }

      if (typeof candidate === 'string') {
        const trimmedCandidate = candidate.trim();
        if (trimmedCandidate.length) {
          return trimmedCandidate;
        }
      } else if (typeof candidate === 'number') {
        return String(candidate);
      }
    }
  }

  const stringified = String(value);
  const trimmedString = stringified.trim();

  if (!trimmedString || trimmedString === '[object Object]') {
    return fallback;
  }

  return trimmedString;
};

const normalizeDateKey = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return null;
};

function getShiftKeyFromEvent(event) {
  if (!event) {
    return null;
  }

  const observationKey =
    SHIFT_OBSERVATION_TO_KEY[(event.observation || '').toLowerCase()];

  if (observationKey) {
    return observationKey;
  }

  const classKey = SHIFT_CLASS_TO_KEY[shiftClassByTime(event.tstart)];
  return classKey || null;
}

const areaDailySlots = computed(() => {
  if (shape.value !== 'area') {
    return {};
  }

  const slots = {};
  const activeInstructorId =
    programmingMode.value && selectedInstructorId.value
      ? selectedInstructorId.value
      : null;

  const ensureDay = (dayKey) => {
    if (!slots[dayKey]) {
      slots[dayKey] = {
        morning: [],
        afternoon: [],
        night: [],
      };
    }

    return slots[dayKey];
  };

  legendInstructors.value.forEach((instructor) => {
    if (activeInstructorId && instructor.id !== activeInstructorId) {
      return;
    }

    const monthlyEvents = instructor?.events || {};

    Object.values(monthlyEvents).forEach((monthEvents) => {
      const entries = Array.isArray(monthEvents)
        ? monthEvents
        : monthEvents
        ? [monthEvents]
        : [];

      entries.forEach((event) => {
        const dayKey = normalizeDateKey(event?.start);
        if (!dayKey) {
          return;
        }

        const shiftKey = getShiftKeyFromEvent(event);
        if (!shiftKey) {
          return;
        }

        const daySlots = ensureDay(dayKey);

        const baseKeyParts = [
          instructor.id,
          event?.start,
          event?.tstart,
          event?.tend,
          event?.fiche,
          event?.environment,
        ].filter(Boolean);

        const slotKey =
          baseKeyParts.join('|') ||
          `${instructor.id}-${dayKey}-${shiftKey}-${daySlots[shiftKey].length}`;

        const { color: _ignoredColor, ...eventInfo } = event || {};

        daySlots[shiftKey].push({
          ...eventInfo,
          instructor: instructor.name,
          instructorId: instructor.id,
          color: instructor.color,
          shiftKey,
          slotKey,
        });
      });
    });
  });

  return slots;
});

const resetReportData = () => {
  calendarOptions.value = [];
  eventsCalender.value = {};
  existInfo.value = false;
  legendInstructors.value = [];
  resetAvailableColors();
  monthHours.value = {};
  months.value = [];
  yearsMonth.value = [];
  nameInstructor.value = '';
  dataFiche.value = '';
  nameEnvironment.value = '';
  hoursWork1.value = 0;
  hoursWork2.value = 0;
  showCalender.value = true;
  print.value = false;
  programmingMode.value = false;
  selectedInstructorId.value = null;
  clearProgrammingSelection();
};

const clearDataCalender = () => {
  resetReportData();
};

watch(
  shape,
  () => {
    resetReportData();
  },
  { flush: 'post' }
);

watch(
  () => legendInstructors.value,
  (list) => {
    if (
      selectedInstructorId.value &&
      (!Array.isArray(list) ||
        !list.some(
          (instructor) => instructor.id === selectedInstructorId.value
        ))
    ) {
      selectedInstructorId.value = null;
    }
  },
  { deep: true }
);

watch(
  [() => programmingMode.value, () => selectedInstructorId.value],
  () => {
    const hasMonths =
      Array.isArray(yearsMonth.value) && yearsMonth.value.length > 0;

    if (shape.value === 'area' && existInfo.value && hasMonths) {
      generateCalendar();
      forceCloseTooltips();
    }
  },
  { flush: 'post' }
);

const router = useRouter();

const useStoreReport = storeReport();

onBeforeMount(async () => {
  opcion.value = router.currentRoute.value.params.opcion;
  isLoadingData.value = true;

  if (role.value == 'USER') {
    opcion.value == 'instructor'
      ? (inst.value = useStoreReport.newConsult)
      : (fiche.value = useStoreReport.newConsult);
  } else {
    opcion.value == 'instructor'
      ? await getInst()
      : opcion.value == 'ficha'
      ? await getFiches()
      : await getEnvironments();
    isLoadingData.value = false;
  }
});

function toggleProgrammingMode() {
  programmingMode.value = !programmingMode.value;

  if (!programmingMode.value) {
    selectedInstructorId.value = null;
    clearProgrammingSelection();
  }
}

function cancel() {
  resetReportData();
  existInfo.value = false;
  fiche.value = '';
  inst.value = '';
  thematicarea.value = '';
  knowledge.value = '';
  environment.value = '';
  fStart.value = '';
  fEnd.value = '';
  nameInstructor.value = '';
  hoursWork1.value = 0;
  hoursWork2.value = 0;
  dataFiche.value = '';
  nameEnvironment.value = '';
  calendarOptions.value = [];
  monthHours.value = {};

  if (role.value == 'USER') {
    useStoreReport.cleanConsult();
    router.push('/consultor');
  }
}

async function sendReport() {
  let data = {
    fiche: fiche.value.value,
    fstart: fStart.value,
    fend: fEnd.value,
  };
  isLoading.value = true;
  await useStoreReport.sendReport(data).then((res) => {
    fiche.value = '';
    fStart.value = '';
    fEnd.value = '';
    months.value = [];
    yearsMonth.value = [];
    eventsCalender.value = {};
    calendarOptions.value = [];
    monthHours.value = {};
    existInfo.value = false;
  });

  isLoading.value = false;
}

function generateCalendar() {
  calendarOptions.value = [];
  if (!Array.isArray(yearsMonth.value) || yearsMonth.value.length === 0) {
    existInfo.value = false;
    return;
  }

  yearsMonth.value.forEach((my) => {
    let events = null;
    let data = null;

    events = generateMonthEvents(my);

    // events = eventsCalender.value[my.split('-')[1]];

    events.forEach((element) => {
      if (element.code) {
        data = changeColor(element);
        if (!data.className) {
          element.backgroundColor = data.backgroundColor;
          element.borderColor = data.borderColor;
          element.textColor = data.textColor;
        } else {
          element.classNames = data.className;
          element.textColor = data.textColor;
        }
      }
    });
    // }

    const formatDate = (
      my.split('-')[0] +
      '-' +
      my.split('-')[1] +
      '-' +
      '01'
    ).toString();

    const calendarConfig = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locale: esLocale,
      timeZone: 'America/Bogota',
      initialView: 'dayGridMonth',
      selectable: true,
      initialDate: formatDate,
      fixedWeekCount: false,
      headerToolbar: {
        left: '',
        center: 'title',
        right: '',
      },
      eventOrder: 'order',
      events,
      };

    if (shape.value === 'area') {
      calendarConfig.selectAllow = () => programmingMode.value && !!selectedInstructorId.value;
      calendarConfig.select = (selectionInfo) => {
        if (programmingMode.value && selectedInstructorId.value) {
          handleAreaDateSelect(selectionInfo);
        }
      };
    }

    calendarOptions.value.push(calendarConfig);
  });

  existInfo.value = true;
}

function handleAreaDateSelect(selectionInfo) {
  if (!programmingMode.value || !selectedInstructorId.value) return;

  const instructor = legendInstructors.value.find(i => i.id === selectedInstructorId.value);
  if (!instructor) return;

  const { start, end } = selectionInfo; // FullCalendar: [start, end)
  if (!(start instanceof Date) || !(end instanceof Date)) return;

  const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toLocaleDateString('sv-SE'); // YYYY-MM-DD

  // busca o crea contenedor del instructor
  const list = [...programmingSelections.value];
  let sel = list.find(x => x.instructorId === instructor.id);
  if (!sel) {
    sel = { instructorId: instructor.id, instructorName: instructor.name, dates: [] };
    list.push(sel);
  }

  // recorre días [start, end)
  const cursor = new Date(start);
  while (cursor < end) {
    const key = normalize(cursor);
    // toggle: si ya estaba, se quita; si no, se agrega
    const idx = sel.dates.indexOf(key);
    if (idx >= 0) sel.dates.splice(idx, 1);
    else sel.dates.push(key);
    cursor.setDate(cursor.getDate() + 1);
  }

  sel.dates.sort((a, b) => a.localeCompare(b));
  // limpia instructores sin fechas
  programmingSelections.value = list.filter(x => x.dates.length);
}

function clearProgrammingSelection() {
  programmingSelections.value = [];
}

function logProgrammingSelection() {
  if (!programmingSelections.value.length) {
    console.log('No hay selección de programación registrada.');
    return;
  }

  console.log('Selección de programación:', JSON.parse(JSON.stringify(programmingSelections.value)));
}

async function getFiches() {
  const res = await useFiches.getFilesActive();
  console.log(res.data);
  res.data.forEach((row, index) => {
    optionsFiches.value.push({
      label: `${row.number} - ${row.program.name}`,
      value: row._id,
    });
    filterFiche.value = optionsFiches.value;
  });
}

async function getInst() {
  const res = await useInstructors.getInst();

  res.data.forEach((row, index) => {
    console.log(row.thematicarea.toLocaleLowerCase());
    optionsInst.value.push({
      label: row.name,
      value: row._id,
      area: row.thematicarea,
    });
  });
}

async function getEnvironments() {
  const res = await useEnvir.getEnvActive();

  res.forEach((row, index) => {
    optionsEnvir.value.push({ label: row.name, value: row._id });
    filterEnvironment.value = optionsEnvir.value;
  });
}

async function getReport() {
  loadingData.value = true;
  resetReportData();
  console.log(copyFilterInst.value);
  
  try {
    if (shape.value == 'area') {
      const list = copyFilterInst.value.map((i) => ({
        id: i.value,
        name: i.label,
        color: generateColor(),
      }));

      console.log(list);
      legendInstructors.value = list;
      console.log(legendInstructors.value);
      

      const { months: mm, yearsMonth: yymm } = computeMonthsYears(
        fStart.value,
        fEnd.value
      );
      months.value = mm;
      yearsMonth.value = yymm;

      for (const prof of legendInstructors.value) {
        try {
          const res = await useStoreReport.generateReportByInstr(
            {
              instructor: prof.id,
              fstart: fStart.value,
              fend: fEnd.value,
            },
            false
          );
            console.log(res);
            
          // cada profe tendrá su registro en un objeto
          prof.events = [];

          if (res?.status <= 201 && res.data?.events) {
            prof.events = res.data.events;
            prof._count = totalEventsByMonthMap(prof.events); // aquí te llega { "06": [...], "07": [...] }
          }
        } catch (e) {
          // si falla, simplemente no tiene eventos
          prof.events = [];
        }
      }

      generateCalendar();
      forceCloseTooltips();
    } else {
      let data = {
        instructor: inst.value.value,
        fstart: fStart.value,
        fend: fEnd.value,
      };

      const res = await useStoreReport.generateReportByInstr(data);
      console.log(res);
      if (res.status <= 201) {
        months.value = res.data.months;
        yearsMonth.value = res.data.yearsMonth;
        eventsCalender.value = res.data.events;
        nameInstructor.value = res.data.instructor;
        hoursWork1.value = res.data.hoursworkFormacion;
        hoursWork2.value = res.data.hoursworkOthers;
        calculateMonthHours();
        generateCalendar();
        forceCloseTooltips();
      }
    }
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'No fue posible generar el reporte. Intenta nuevamente.',
    });
  } finally {
    loadingData.value = false;
  }
}

async function exportCalender() {
  isLoading.value = true;
  let calenderExport = document.getElementById('calenderPrint');
  //agregar la clase maxSize
  calenderExport.classList.add('maxSizeCalender');
  showCalender.value = false;

  await new Promise((resolve) => setTimeout(resolve, 100));
  showCalender.value = true;
  print.value = true;

  const notif = $q.notify({
    type: 'ongoing',
    message: 'Generando pdf...',
    position: 'top',
  });

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    //el formato más grande posible
    format: [1500, 820],
    compress: true,
    precision: 2, //para que no se vea borroso el texto
  });

  doc.html(calenderExport, {
    callback: async function (doc) {
      doc.save('reporte.pdf');

      notif({
        type: 'positive',
        message: 'Tu archivo se ha generado correctamente',
        timeout: 1000,
        position: 'top',
      });

      calenderExport.classList.remove('maxSizeCalender');
      showCalender.value = false;
      print.value = false;
      await new Promise((resolve) => setTimeout(resolve, 100));
      showCalender.value = true;
      isLoading.value = false;
    },
    margin: [70, 20, 70, 20], //margen superior, izquierdo, inferior, derecho
  });
}

async function saveExcel() {
  await excelToReports(eventsCalender.value);
}

function filterThematicarea(val, update, abort) {
  update(() => {
    const copyOptionsThematicarea = [...knowledge.value.areas];
    const needle = val.toLocaleLowerCase();
    optionsThematicarea.value = copyOptionsThematicarea.filter((v) => {
      return v.toLocaleLowerCase().indexOf(needle) > -1;
    });
  });
}

function filterKnowledge(val, update, abort) {
  update(() => {
    const copyOptionsKnowledge = [...dataRedConocimiento];

    const needle = val.toLocaleLowerCase();
    optionsKnowledge.value = copyOptionsKnowledge.filter((v) => {
      return v.red.toLocaleLowerCase().indexOf(needle) > -1;
    });
  });
}

function filterInstru(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase();

    filterInstructor.value = copyFilterInst.value.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

// Filtra los instructores según el área temática seleccionada en el combo
// y reinicia la selección actual.
function handleThematicareaChange(selectedArea) {
  // al cambiar de área se limpia la opción del instructor actual
  inst.value = null;

  // cuando no se selecciona ningún área se limpian las listas
  if (!selectedArea) {
    filterInstructor.value = [];
    copyFilterInst.value = [];
    return;
  }

  // se filtran solo los instructores cuyo campo "area" coincide
  copyFilterInst.value = optionsInst.value.filter(
    (i) =>
      i.area.trim().toLocaleLowerCase() === selectedArea.toLocaleLowerCase()
  );

  // el arreglo resultante se usa para mostrar las opciones disponibles
  filterInstructor.value = [...copyFilterInst.value];
}

// Convierte un texto de hora (ej. "10:30 P.M.") a minutos desde la medianoche.
function parseTimeToMinutes(timeText) {
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

// Recorre los eventos del calendario y suma las horas trabajadas en cada mes.
function calculateMonthHours() {
  monthHours.value = {};
  if (!eventsCalender.value || !yearsMonth.value) return;

  yearsMonth.value.forEach((my) => {
    const monthKey = my.split('-')[1];
    const events = eventsCalender.value[monthKey] || [];
    let minutes = 0;

    // se calcula la diferencia entre hora inicial y final de cada evento
    events.forEach((ev) => {
      const start = parseTimeToMinutes(ev.tstart);
      const end = parseTimeToMinutes(ev.tend);
      if (!isNaN(start) && !isNaN(end) && end > start) {
        minutes += end - start;
      }
    });

    // los minutos acumulados se convierten a horas y se guardan por mes
    monthHours.value[my] = minutes / 60;
  });
}

// Devuelve una paleta de colores según el turno del evento.
function changeColor(event) {
  // normaliza el texto para comparar sin acentos ni mayúsculas
  const shiftLower = event.observation.toLowerCase();

  if (shiftLower === 'jornada mañana') {
    return {
      backgroundColor: '#FFD926',
      borderColor: '#FFD926',
      textColor: '#000000',
    };
  } else if (shiftLower === 'jornada tarde') {
    return {
      backgroundColor: '#35F527',
      borderColor: '#35F527',
      textColor: '#000000',
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
      backgroundColor: '#00008B',
      borderColor: '#00008B',
      textColor: '#FFFFFF',
    };
  }
}

// Genera la lista de meses entre dos fechas en formato "aaaa/mm/dd".
// Se usa para construir la matriz de eventos en el calendario.
// Está basada en la misma lógica del backend para evitar desfaces.
function computeMonthsYears(fstartStr, fendStr) {
  const toISO = (s) => (s || '').replace(/\//g, '-'); // "aaaa/mm/dd" -> "aaaa-mm-dd"
  const start = new Date(toISO(fstartStr));
  const end = new Date(toISO(fendStr));

  const months = []; // ["06","07","08"]
  const yearsMonth = []; // ["2025-06","2025-07","2025-08"]

  // usamos UTC como en el back (getUTCMonth / getUTCFullYear) para evitar TZ
  let cursor = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1)
  );
  const endUTC = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));

  // se avanza mes a mes agregando las representaciones necesarias
  while (cursor <= endUTC) {
    const mm = String(cursor.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = cursor.getUTCFullYear();
    months.push(mm);
    yearsMonth.push(`${yyyy}-${mm}`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return { months, yearsMonth };
}

// Genera tres eventos diarios (mañana, tarde y noche) para un rango de fechas.
function generateDailyEvents(startDate, endDate) {
  const events = [];
  const start = new Date(startDate.replace(/\//g, '-'));
  const end = new Date(endDate.replace(/\//g, '-'));

  // recorre cada día dentro del rango
  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    // se crean los tres turnos básicos
    events.push(
      {
        start: new Date(y, m, d, 6, 30, 0, 0),
        end:   new Date(y, m, d, 12, 30, 0, 0),
        title: '\u200B',
        observation: 'JORNADA MAÑANA',
        allDay: true,
        backgroundColor: '#ffffff',
        borderColor: shape.value == 'area' ? '#FFD926' : '#929292',
        order: 1,
        className: 'jornada-mañana',
      },
      {
        start: new Date(y, m, d, 12, 30, 0, 0),
        end:   new Date(y, m, d, 18, 30, 0, 0),
        title: '\u200B',
        observation: 'JORNADA TARDE',
        allDay: true,
        backgroundColor: '#ffffff',
        borderColor: shape.value == 'area' ? '#0BF468' : '#929292',
        order: 2,
        className: 'jornada-tarde',
      },
      {
        start: new Date(y, m, d, 18, 30, 0, 0),
        end:   new Date(y, m, d, 23, 30, 0, 0),
        title: '\uFEFF',
        observation: 'JORNADA NOCHE',
        allDay: true,
        backgroundColor: '#ffffff',
        borderColor: shape.value == 'area' ? '#00008B' : '#929292',
        order: 3,
        className: 'jornada-noche',
      }
    );
  }

  return events;
}

// Devuelve un color hexadecimal aleatorio para diferenciar eventos.
function generateColor() {
  if (!availableColors.length) {
    console.warn(
      '[Consult3.0] Se agotaron los colores disponibles en la paleta definida.'
    );
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableColors.length);
  const [color] = availableColors.splice(randomIndex, 1);
  return color;
}

// Genera todos los eventos de un mes fusionando los turnos base con los
// registros reales obtenidos del backend.
function generateMonthEvents(my) {
  // separa el identificador "aaaa-mm" para ubicar el mes en los datos
  const [year, month] = my.split('-');
  const calendarMonthEvents = eventsCalender.value?.[month] || [];

  // límites del mes y del rango global solicitado por el usuario
  const monthStart = new Date(`${year}-${month}-01`);
  const monthEnd = new Date(year, month, 0);
  const globalStart = new Date(fStart.value.replace(/\//g, '-'));
  const globalEnd = new Date(fEnd.value.replace(/\//g, '-'));

  const startRange = monthStart > globalStart ? monthStart : globalStart;
  const endRange = monthEnd < globalEnd ? monthEnd : globalEnd;

  // crea los tres turnos por día dentro del rango efectivo
  let events = generateDailyEvents(
    startRange.toISOString().split('T')[0],
    endRange.toISOString().split('T')[0]
  );

  const pendingMixtos = [];
  const pendingKeys = new Set(); // almacena llaves únicas para jornadas mixtas

  // mezcla los eventos reales con los slots del calendario
  events.forEach((a, i) => {
    const dayKey = normalizeDateKey(a.start);

    calendarMonthEvents.forEach((b) => {
      if (dayKey && dayKey === normalizeDateKey(b.start)) {
        const slotStart = a.start.getHours() * 60 + a.start.getMinutes();
        const slotEnd = a.end.getHours() * 60 + a.end.getMinutes();

        if (b.observation === 'JORNADA MIXTA') {
          const startMinutes = parseTimeToMinutes(b.tstart);
          const mixType =
            startMinutes < 750 ? 'morning-afternoon' : 'afternoon-night';

          // primera mitad de la jornada mixta
          if (startMinutes >= slotStart && startMinutes < slotEnd) {
            events[i] = {
              ...b,
              order: a.order,
              mixPart: 1,
              mixType,
            };
          }

          // prepara la segunda mitad para el siguiente bloque
          const mixtoItem = {
            ...b,
            order: a.order + 1,
            start: dayKey,
            mixPart: 2,
            mixType,
          };

          // genera llave única para evitar duplicados
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

  // inserta las segundas mitades de jornadas mixtas en los slots siguientes
  events.forEach((a, i) => {
    const dayKey = new Date(a.start).toLocaleDateString('sv-SE');

    const b = pendingMixtos.find(
      (x) => x.start === dayKey && a.order === x.order
    );

    if (b) {
      events[i] = { ...b, order: a.order };
    }
  });

  // ordena cronológicamente para que FullCalendar respete la secuencia
  events.sort((a, b) => a.order - b.order);

  // aplica colores según el tipo de jornada
  events.forEach((element) => {
    if (element.code) {
      const data = changeColor(element);
      if (!data.className) {
        element.backgroundColor = data.backgroundColor;
        element.borderColor = data.borderColor;
        element.textColor = data.textColor;
      } else {
        element.classNames = data.className;
        element.textColor = data.textColor;
      }
    }
  });

  if (shape.value === 'area') {
    return events.map((event) => {
      const dayKey  = normalizeDateKey(event.start);
      const shiftKey = getShiftKeyFromEvent(event); // por observation o por hora del slot
      const daySlots = dayKey ? areaDailySlots.value?.[dayKey] : null;
      const areaItems = (daySlots && shiftKey) ? (daySlots[shiftKey] || []) : [];

      return {
        ...event,
        extendedProps: {
          ...(event.extendedProps || {}),
          shiftKey,
          areaItems,     // ← los punticos del template
        },
      };
    });
  }

  return events;
}

function shiftClassByTime(time) {
  const minutes = parseTimeToMinutes(time);
  if (minutes >= 390 && minutes < 750) return 'jornada-mañana';
  if (minutes >= 750 && minutes < 1110) return 'jornada-tarde';
  if (minutes >= 1110 && minutes < 1410) return 'jornada-noche';
  return null;
}
</script>

<style>
:root{
  /* Sube el mínimo para que NO se comprima en móviles */
  --cal-min-width: 1300px;     /* ajusta a tu gusto: 1200-1600 suele ir bien */
  --cal-height: 760px;         /* más alto = días con más aire */
}

/* Contenedor que habilita el scroll horizontal */
.calendar-scroll{
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;          /* para tooltips que se salgan hacia abajo */
  -webkit-overflow-scrolling: touch;
  padding-bottom: 6px;          /* deja espacio a la barra */
}

/* Estilo de la tabla-calendario */
.calender{
  /* No uses width:100% si quieres overflow; dale un mínimo y deja que se desborde */
  min-width: var(--cal-min-width);
  width: var(--cal-min-width);      /* se mantiene grande y el contenedor scrollea */
  height: var(--cal-height);
  margin-inline: auto;
}

/* Opcional: scrollbar un poco más decente */
.calendar-scroll::-webkit-scrollbar { height: 10px; }
.calendar-scroll::-webkit-scrollbar-track { background: #f0f0f0; }
.calendar-scroll::-webkit-scrollbar-thumb { background: #c4c4c4; border-radius: 6px; }
.calendar-scroll:hover::-webkit-scrollbar-thumb { background: #a8a8a8; }

.area-event {
  width: 100%;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  padding: 2px 4px;
}

.area-event__dots {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.area-event__menu {
  display: inline-flex;
}

.area-event__dot {
  width: 16px;
  height: 16px;
  text-align: center  ;
  padding: 2px;
  border-radius: 50%;
  display: inline-flex;
  cursor: pointer;
}



.fc-daygrid-day { overflow: hidden; }


/* Leyenda de horarios */
.time-legend {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  font-weight: 600;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-item.morning .legend-color {
  background-color: #ffd926;
}

.legend-item.afternoon .legend-color {
  background-color: #35f527;
}

.legend-item.night .legend-color {
  background-color: #00008b;
}

.legend-item.mixta .legend-color {
  background-color: #ff829b;
}

.hoursmonth {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 300%); /* baja 10px más */
}

.fc-theme-standard td,
.fc-theme-standard th {
  border-color: rgb(65, 64, 64);
}

.fc .fc-scrollgrid-liquid {
  border-color: rgb(65, 64, 64);
}

.jornada-mañana,
.jornada-tarde,
.jornada-noche {
  border-width: 2px !important;
  border-style: solid;
}

/* .jornadaMixta {
  border-radius: 3px;
  border: 1px solid transparent !important;  fuerza ancho/estilo del borde 
  border-image: none !important;             neutraliza intentos previos 
  background-origin: border-box;
  background-clip: padding-box, border-box !important;
  overflow: hidden;respeta el radius con fondos múltiples 
  background:
    linear-gradient(to right, #fedd07, #6d83c9) padding-box,
    linear-gradient(to right, #fedd07, #6d83c9) border-box !important;
} */

.legend-toolbar {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.legend-entry {
  align-items: center;
}

.legend-color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.legend-radio {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  position: relative;
}

.legend-radio__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.legend-radio__dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #000;
  transition: background-color 0.2s ease, border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.legend-radio__input:focus-visible + .legend-radio__dot {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
}

.legend-radio__label {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Contenedor general del legend */
.legend-wrapper {
  border: 1px solid rgba(0,0,0,.2);
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  max-width: 1200px;
  margin: 20px auto 0;
}

/* Barra superior: buscador y toggle */
.legend-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.legend-search {
  width: min(420px, 100%);
}

/* Grid fluido y accesible */
.legend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px 12px;
  max-height: clamp(180px, 36vh, 320px);
  overflow-y: auto;
  padding-right: 4px; /* deja respirar la barra de scroll */
}

/* Chip del instructor */
.legend-chip {
  --chip-color: #999; /* fallback */
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 999px;
  background: #fafafa;
  min-width: 0;
  transition: box-shadow .15s ease, border-color .15s ease, background-color .15s ease;
}

.legend-chip:hover {
  background: #f3f3f3;
}

.legend-chip.is-selected {
  border-color: var(--chip-color);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--chip-color) 28%, transparent);
}

/* Modo compacto: menos padding y tipografía ajustada */
.legend-chip.is-compact {
  padding: 6px 10px;
}

.legend-chip__radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.legend-chip__swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex: 0 0 auto;
  background: var(--chip-color);
  outline: 2px solid rgba(0,0,0,.06);
}

.legend-chip__name {
  font-size: .875rem;
  font-weight: 500;
  letter-spacing: .2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.legend-chip__count {
  margin-left: auto;
  font-size: .75rem;
  padding: 2px 6px;
  border-radius: 999px;
  background: #eee;
  color: #333;
}

/* El swatch por defecto (fuera de programación) sigue relleno */
.legend-chip__swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex: 0 0 auto;
  background: var(--chip-color);
  border: 2px solid var(--chip-color);
  transition: background-color .15s ease, border-color .15s ease, box-shadow .15s ease;
}

/* En modo programación: todos se ven sin relleno... */
.is-programming .legend-chip:not(.is-selected) .legend-chip__swatch {
  background: transparent;
}

/* ...y el seleccionado se rellena. */
.is-programming .legend-chip.is-selected .legend-chip__swatch {
  background: var(--chip-color);
  border-color: var(--chip-color);
}

/* Buen feedback visual cuando está seleccionado */
.legend-chip.is-selected {
  border-color: var(--chip-color);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--chip-color) 28%, transparent);
}

/* Barra de acciones responsive */
.actions-bar{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, max-content));
  justify-content: end;
  align-items: center;
  gap: 8px 10px;
  margin: 8px 0 12px;
}

/* El popper no “engorda” el viewport */
.v-popper__popper {
  max-width: min(92vw, 460px);
  contain: layout paint;
}

/* Contenido scrollable y seleccionable */
.content-tooltip-event,
.content-tooltip-event1 {
  max-width: min(92vw, 460px);
  max-height: min(60vh, 420px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 10px;
  user-select: text;
}

/* En pantallas pequeñas: 2 columnas y botones a lo ancho */
@media (max-width: 600px){
  .actions-bar{
    grid-template-columns: repeat(2, minmax(0,1fr));
    justify-content: center;
  }
  .actions-bar .q-btn{
    width: 100%;
  }
}

/* En móviles muy angostos, fila única apilada */
@media (max-width: 420px){
  .actions-bar{
    grid-template-columns: 1fr;
  }
}

/* Mobile tweaks */
@media (max-width: 600px) {
  .legend-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    max-height: 40vh;
  }
}
</style>
