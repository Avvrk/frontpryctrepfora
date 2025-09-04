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
        <div class="col-11 col-sm-6 q-px-md" v-if="opcion == 'instructor'">
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
            </q-btn>
          </div>
        </div>
      </div>
    </q-form>

    <div class="row justify-center" v-if="existInfo">
      <div
        class="col-11 justify-end flex"
        :class="
          $q.screen.width < 600 ? 'justify-center q-gutter-sm' : 'justify-end'
        "
      >
        <q-btn
          label="Generar PDF"
          icon="print"
          class="bg-green-7 text-white q-mr-md"
          @click="exportCalender()"
        />

        <q-btn
          label="Generar excel"
          icon="print"
          class="bg-green-9 text-white q-mr-md"
          @click="saveExcel()"
        />

        <q-btn
          v-if="opcion == 'ficha' && role !== 'USER'"
          label="Enviar"
          icon="send"
          class="bg-green-9 text-white q-mr-md"
          @click="sendReport()"
          :loading="isLoading"
          :disable="isLoading"
        >
          <template v-slot:loading>
            <q-spinner-oval color="white" size="1em" />
          </template>
        </q-btn>

        <q-btn
          label="Cancelar"
          icon="cancel"
          class="bg-red-5 text-white"
          @click="cancel()"
        />
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
      <div class="te" v-if="shape === 'area' && existInfo">
        <!-- <p>q-mt-md q-mb-lg flex items-center justify-center gap-3</p> -->
        <div
          v-for="p in legendInstructors"
          :key="p.id"
          class="flex items-center q-mr-md to"
        >
          <span
            :style="{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'inline-block',
              background: p.color,
              marginRight: '6px',
            }"
          ></span>
          <span class="text-caption">{{ p.name }}</span>
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
      </div>
      <div id="calenderHour" v-for="(c, i) in calendarOptions" :key="i">
        <div class="row justify-center hoursmonth" v-if="existInfo">
          <div>
            HORAS DEL MES:
            {{ Math.ceil(monthHours[yearsMonth[i]] || 0) }} HORAS
          </div>
        </div>
        <div class="row justify-center flex" v-if="existInfo && showCalender">
          <div class="col-10 q-pb-lg q-mt-md justify-center flex">
            <FullCalendar id="calender" class="text-uppercase" :options="c">
              <template v-if="opcion == 'instructor'" v-slot:eventContent="arg">
                <VMenu
                  :autoHide="false"
                  :delay="0"
                  class="justify-center items-center customEvents"
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
                        ACTIVIDAD ADICIONAL:{{
                          arg.event.extendedProps.additionalactivity
                        }}
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
                  class="justify-center items-center customEvents"
                  v-else
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
              <template v-else-if="opcion == 'ficha'" v-slot:eventContent="arg">
                <VMenu
                  :autoHide="false"
                  :delay="0"
                  class="justify-center items-center customEvents"
                >
                  <span>
                    <b>{{ arg.timeText }}</b>
                    <i>{{ arg.event.title }}</i></span
                  >

                  <template #popper>
                    <div class="content-tooltip-event">
                      <p>INSTRUCTOR: {{ arg.event.title }}</p>
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
              <template v-else v-slot:eventContent="arg">
                <VMenu
                  :autoHide="false"
                  :delay="0"
                  class="justify-center items-center customEvents"
                >
                  <span>
                    <i>{{ arg.event.extendedProps.fiche }}</i>
                    <br />
                    <i
                      >({{ arg.event.extendedProps.tstart }} -
                      {{ arg.event.extendedProps.tend }})</i
                    >
                  </span>

                  <template #popper>
                    <div class="content-tooltip-event">
                      <p>INSTRUCTOR: {{ arg.event.title }}</p>
                      <p>FICHA: {{ arg.event.extendedProps.fiche }}</p>
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

      <!-- <div
        class="q-mb-md row"
        style="display: grid; justify-content: center"
        v-if="existInfo"
      >
        <tableFormacion
          :events="eventsCalender"
          :existInfo="existInfo"
          :print="print"
        />

        <tableOtrasActividades
          :events="eventsCalender"
          :existInfo="existInfo"
          :print="print"
        />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, nextTick } from 'vue';
import { storeFiles } from '../store/Files.js';
import { storeInst } from '../store/Instructors.js';
import { storeReport } from '../store/Reports.js';
import { event, format, useQuasar } from 'quasar';
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
import tableFormacion from '../components/Reports/tables/tableFormacion.vue';
import tableOtrasActividades from '../components/Reports/tables/tableOtrasActividades.vue';
import { excelToReports } from '../services/excelToReports.js';

import BtnBack from '../layouts/btnBackLayout.vue';
import HeaderLayout from '../layouts/headerViewsLayout.vue';
import { symOutlinedAirlineSeatFlatAngled } from '@quasar/extras/material-symbols-outlined';

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
let months = ref();
let yearsMonth = ref();
let eventsCalender = ref();
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

function cancel() {
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
    months.value = '';
    yearsMonth.value = '';
    eventsCalender.value = '';
    calendarOptions.value = [];
    monthHours.value = {};
    existInfo.value = false;
  });

  isLoading.value = false;
}

function parseTimeToMinutes(timeText) {
  if (!timeText) return NaN;
  const text = timeText.trim();
  if (/A\.M\.|P\.M\./i.test(text)) {
    const [time, period] = text.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (/P\.M\./i.test(period) && h !== 12) h += 12;
    if (/A\.M\./i.test(period) && h === 12) h = 0;
    return h * 60 + m;
  }
  const [h, m] = text.split(':').map(Number);
  return h * 60 + m;
}

function calculateMonthHours() {
  monthHours.value = {};
  if (!eventsCalender.value || !yearsMonth.value) return;
  yearsMonth.value.forEach((my) => {
    const monthKey = my.split('-')[1];
    const events = eventsCalender.value[monthKey] || [];
    let minutes = 0;
    events.forEach((ev) => {
      const start = parseTimeToMinutes(ev.tstart);
      const end = parseTimeToMinutes(ev.tend);
      if (!isNaN(start) && !isNaN(end) && end > start) {
        minutes += end - start;
      }
    });
    monthHours.value[my] = minutes / 60;
  });
}

function horaSiguiente(text) {
  const inicMañana = 390;
  const finMañana = 749;
  const inicTarde = 750;
  const finTarde = 1109;
  // const inicNoche = 1110;
  // const finNoche = 1410;
  const nhora = parseTimeToMinutes(text);

  if (nhora >= inicMañana && nhora <= finMañana) {
    return { tstart: '12:30 P.M.', tend: '6:29 P.M.' };
  } else if (nhora >= inicTarde && nhora <= finTarde) {
    return { tstart: '6:30 P.M.', tend: '11:30 P.M.' };
  }
}

function generateCalendar() {
  yearsMonth.value.forEach((my) => {
    let events = null;
    let data = null;

    // if (shape.value === 'area') {
    //   events = eventsCalender.value[my.split('-')[1]];
    // } else {
    const [year, month] = my.split('-');
    const calendarMonthEvents = eventsCalender.value?.[month] || [];
    const monthStart = new Date(`${year}-${month}-01`);
    const monthEnd = new Date(year, month, 0);
    const globalStart = new Date(fStart.value.replace(/\//g, '-'));
    const globalEnd = new Date(fEnd.value.replace(/\//g, '-'));

    const startRange = monthStart > globalStart ? monthStart : globalStart;
    const endRange = monthEnd < globalEnd ? monthEnd : globalEnd;

    events = generateDailyEvents(
      startRange.toISOString().split('T')[0],
      endRange.toISOString().split('T')[0]
    );

    if (shape.value === 'area') {

    }
    const eventoMixto = ref(null);
    const mixto = ref(0);

    events.forEach((a, i) => {
      if (
        mixto.value === 1 &&
        a.start.toLocaleDateString('sv-SE') === eventoMixto.value.start
      ) {
        const slotStart = a.start.getHours() * 60 + a.start.getMinutes();
        const slotEnd = a.end.getHours() * 60 + a.end.getMinutes();
        const startMinutes = parseTimeToMinutes(eventoMixto.value.tnstart);

        if (startMinutes >= slotStart && startMinutes < slotEnd) {
          events[i] = { ...eventoMixto.value };
          mixto.value = 0;
          eventoMixto.value = null;
        }
      }
      calendarMonthEvents.forEach((b) => {
        if (a.start.toLocaleDateString('sv-SE') === b.start) {
          const slotStart = a.start.getHours() * 60 + a.start.getMinutes();
          const slotEnd = a.end.getHours() * 60 + a.end.getMinutes();

          if (b.observation == 'JORNADA MIXTA') {
            const sameDayMix = calendarMonthEvents.filter(
              (e) => e.start === b.start && e.observation === 'JORNADA MIXTA'
            );

            const startMinutes = parseTimeToMinutes(b.tstart);
            // const endMinutes = parseTimeToMinutes(b.tend);

            if (startMinutes >= slotStart && startMinutes < slotEnd) {
              events[i] = { ...b, order: a.order };
            }

            if (sameDayMix.length === 1) {
              mixto.value = 1;
              const nh = horaSiguiente(b.tstart);
              eventoMixto.value = {
                ...b,
                tnstart: nh.tstart,
                tnend: nh.tend,
                order: a.order + 1,
              };
            }
          } else if (b.observation == a.observation) {
            events[i] = { ...b, order: a.order };
          }
        }
      });
      events.sort((a, b) => a.order - b.order);
    });

    // events = eventsCalender.value[my.split('-')[1]];

    events.forEach((element) => {
      if (element.code) {
        data = changeColor(element.observation);
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

    calendarOptions.value.push({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locale: esLocale,
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
      datesSet: function () {
        addColors();
      },
    });
  });

  existInfo.value = true;
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

// es para la generacion del calendario, ya que puede que
// todos los instructores que se pidan no tengan formacion
// entonces el backend solo votara el error de vacio, el codigo
// que se uso es como esta en el backend
function computeMonthsYears(fstartStr, fendStr) {
  const toISO = (s) => (s || '').replace(/\//g, '-'); // "aaaa/mm/dd" -> "aaaa-mm-dd"
  const start = new Date(toISO(fstartStr));
  const end = new Date(toISO(fendStr));

  const months = []; // ["06","07","08"]
  const yearsMonth = []; // ["2025-06","2025-07","2025-08"]

  // usamos UTC como en el back (getUTCMonth / getUTCFullYear)
  let cursor = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1)
  );
  const endUTC = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));

  while (cursor <= endUTC) {
    const mm = String(cursor.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = cursor.getUTCFullYear();
    months.push(mm);
    yearsMonth.push(`${yyyy}-${mm}`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return { months, yearsMonth };
}

async function getReport() {
  if (shape.value == 'area') {
    console.log(copyFilterInst.value);
    const list = copyFilterInst.value.map((i) => ({
      id: i.value,
      name: i.label,
      color: generateColor(),
    }));

    console.log(list);
    legendInstructors.value = list;

    const { months: mm, yearsMonth: yymm } = computeMonthsYears(
      fStart.value,
      fEnd.value
    );
    months.value = mm;
    yearsMonth.value = yymm;

    for (const prof of legendInstructors.value) {
      try {
        const res = await useStoreReport.generateReportByInstr({
          instructor: prof.id,
          fstart: fStart.value,
          fend: fEnd.value,
        });

        // cada profe tendrá su registro en un objeto
        prof.events = [];

        if (res?.status <= 201 && res.data?.events) {
          prof.events = res.data.events; // aquí te llega { "06": [...], "07": [...] }
        }
      } catch (e) {
        // si falla, simplemente no tiene eventos
        prof.events = [];
      }
    }
    console.log(legendInstructors.value);
    generateCalendar();
  } else {
    let data = {
      instructor: inst.value.value,
      fstart: fStart.value,
      fend: fEnd.value,
    };

    await useStoreReport.generateReportByInstr(data).then((res) => {
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
      }
    });
  }
  loadingData.value = false;
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

function filterFicha(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase();

    filterFiche.value = optionsFiches.value.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
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

function filterEnvi(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase();

    filterEnvironment.value = optionsEnvir.value.filter(
      (v) => v.label.toLocaleLowerCase().indexOf(needle) > -1
    );
  });
}

function handleThematicareaChange(selectedArea) {
  inst.value = null;

  if (!selectedArea) {
    filterInstructor.value = [];
    copyFilterInst.value = [];
    return;
  }

  copyFilterInst.value = optionsInst.value.filter(
    (i) =>
      i.area.trim().toLocaleLowerCase() === selectedArea.toLocaleLowerCase()
  );

  filterInstructor.value = [...copyFilterInst.value];
}

function changeColor(shift) {
  const shiftLower = shift.toLowerCase();
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
      className: 'jornadaMixta',
      textColor: '#FFFFFF',
    };
  } else {
    return {
      backgroundColor: '#6d83c9',
      borderColor: '#6d83c9',
      textColor: '#FFFFFF',
    };
  }
}

function generateDailyEvents(startDate, endDate) {
  const events = [];
  const start = new Date(startDate.replace(/\//g, '-'));
  const end = new Date(endDate.replace(/\//g, '-'));

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const baseDate = new Date(date);
    baseDate.setDate(baseDate.getDate() + 1);

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

function generateColor() {
  const letter = '01233456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letter[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addColors() {
  nextTick(() => {
    document.querySelectorAll('.fc-day').forEach((dayEl) => {
      const dateStr = dayEl.getAttribute('data-date');
      console.log('Fecha del día:', dateStr);
    });
  });
}
</script>

<style>
#calender {
  width: 1000px !important;
  height: 665px !important;
}

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
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-item.morning .legend-color {
  background-color: #fedd07;
}

.legend-item.afternoon .legend-color {
  background-color: #fe9707;
}

.legend-item.night .legend-color {
  background-color: #6d83c9;
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

.jornadaMixta {
  background: linear-gradient(to right, #fedd07 0%, #fe9707 40%, #6d83c9 100%);
  /* color: white !important; */
  border: 1px solid transparent !important;
}

.to {
  width: 300px;
}

.te {
  border: 1px solid black;
  border-radius: 10px;
  width: 90vw;
  padding: 30px 10px 30px 60px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  position: relative;
  left: 50%;
  transform: translate(-50%);
  margin-top: 30px;
}
</style>
