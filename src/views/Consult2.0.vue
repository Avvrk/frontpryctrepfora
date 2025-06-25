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
      <div class="row justify-center flex">
        <div class="col-11 col-sm-3 q-px-md" v-if="opcion == 'ficha'">
          <q-select
            :disable="isLoadingData"
            filled
            v-model="fiche"
            label="Ficha"
            use-input
            hide-selected
            options-dense
            fill-input
            input-debounce="0"
            :popup-content-style="{ width: '300px' }"
            :options="filterFiche"
            @filter="filterFicha"
            lazy-rules
            :rules="[(val) => !!val || 'El campo es requerido']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
            <template v-slot:prepend>
              <span class="material-symbols-outlined"> dataset </span>
            </template>
          </q-select>
        </div>
        <div class="col-11 col-sm-3 q-px-md" v-if="opcion == 'instructor'">
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
        <div class="col-11 col-sm-3 q-px-md" v-if="opcion == 'ambiente'">
          <q-select
            filled
            :disable="isLoadingData"
            v-model="environment"
            label="Ambiente"
            use-input
            hide-selected
            options-dense
            fill-input
            input-debounce="0"
            :options="filterEnvironment"
            @filter="filterEnvi"
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

        <div class="col-11 col-sm-3 q-px-md">
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
        </div>

        <div class="col-11 col-sm-3 q-px-md">
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
        </div>

        <div class="col-2 col-sm-1 justify-center flex-center q-mt-sm q-mx-md">
          <q-btn
            :loading="loadingData"
            type="submit"
            class="bg-green-9 text-white"
          >
            REPORTE
          </q-btn>
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
        <div class="col-9 q-mb-md q-mt-sm">
          <spam class="text-h6" v-if="opcion == 'instructor' && existInfo">
            <spam class="text-weight-bold"> INSTRUCTOR: </spam
            >{{ nameInstructor.toUpperCase() }}
            <br />
            <spam class="text-weight-bold"> HORAS DE FORMACIÓN: </spam
            >{{ Math.ceil(hoursWork1) }} HORAS
            <br />
            <spam class="text-weight-bold"> HORAS DE OTRAS ACTIVIDADES: </spam
            >{{ Math.ceil(hoursWork2) }} HORAS
            <br />
            <spam class="text-weight-bold"> TOTAL DE HORAS: </spam
            >{{ Math.ceil(hoursWork1 + hoursWork2) }} HORAS
          </spam>
          <spam class="text-h6" v-if="opcion == 'ficha' && existInfo">
            <spam class="text-weight-bold"> FICHA: </spam
            >{{ dataFiche.toUpperCase() }}
          </spam>
          <spam class="text-h6" v-if="opcion == 'ambiente' && existInfo">
            <spam class="text-weight-bold"> AMBIENTE: </spam
            >{{ nameEnvironment.toUpperCase() }}
          </spam>
        </div>
      </div>
      <div id="calenderHour" v-for="(c, i) in calendarOptions" :key="i">
        <div class="row justify-center flex" v-if="existInfo && showCalender">
          <div class="col-10 q-pb-lg q-mt-md justify-center flex">
            <div class="time-legend q-mb-md">
              <div class="legend-item morning">
                <span class="legend-color"></span>
                <span>Mañana (6:00 AM - 12:00 PM)</span>
              </div>
              <div class="legend-item afternoon">
                <span class="legend-color"></span>
                <span>Tarde (12:00 PM - 6:00 PM)</span>
              </div>
              <div class="legend-item night">
                <span class="legend-color"></span>
                <span>Noche (6:00 PM - 6:00 AM)</span>
              </div>
            </div>
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

      <div
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, nextTick } from 'vue';
import { storeFiles } from '../store/Files.js';
import { storeInst } from '../store/Instructors.js';
import { storeReport } from '../store/Reports.js';
import { format, useQuasar } from 'quasar';
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

const $q = useQuasar();

const useFiches = storeFiles();
const useInstructors = storeInst();
const useEnvir = storeEnv();
// is role USER
const useUser = storeUser();
const role = ref(useUser.getRole());

let fiche = ref();
let inst = ref();
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
let knowledge = ref();
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
  environment.value = '';
  fStart.value = '';
  fEnd.value = '';
  nameInstructor.value = '';
  hoursWork1.value = 0;
  hoursWork2.value = 0;
  dataFiche.value = '';
  nameEnvironment.value = '';
  calendarOptions.value = [];

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
    existInfo.value = false;
  });

  isLoading.value = false;
}

function generateCalendar() {
  yearsMonth.value.forEach((my) => {
    let events = null;
    let color = null;

    events = eventsCalender.value[my.split('-')[1]];

    events.forEach((element) => {
      color = changeColor(element.observation);
      element.backgroundColor = color.backgroundColor;
      element.borderColor = color.borderColor;
      element.textColor = color.textColor;
      element.className = getShiftClass(element.observation)

      console.log(element);
    });

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
      events,
      datesSet: function () {
        addTimeSlotDivisions();
      },
      // También agregar en eventDidMount por si acaso
      eventDidMount: function () {
        // Pequeño delay para que se rendericen los eventos
        setTimeout(addTimeSlotDivisions, 50);
      },
    });
  });
  // Agregar divisiones iniciales y configurar clicks
  addTimeSlotDivisions();

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

async function getReport() {
  loadingData.value = true;
  if (opcion.value == 'instructor') {
    let data = {
      instructor: inst.value.value,
      fstart: fStart.value,
      fend: fEnd.value,
    };

    await useStoreReport.generateReportByInstr(data).then((res) => {
      if (res.status <= 201) {
        months.value = res.data.months;
        yearsMonth.value = res.data.yearsMonth;
        eventsCalender.value = res.data.events;
        nameInstructor.value = res.data.instructor;
        hoursWork1.value = res.data.hoursworkFormacion;
        hoursWork2.value = res.data.hoursworkOthers;

        generateCalendar();
      }
    });
  } else if (opcion.value == 'ficha') {
    let data = {
      fiche: fiche.value.value,
      fstart: fStart.value,
      fend: fEnd.value,
    };
    await useStoreReport.generateReport(data).then((res) => {
      if (res.status <= 201) {
        months.value = res.data.months;
        yearsMonth.value = res.data.yearsMonth;
        eventsCalender.value = res.data.events;
        dataFiche.value = `${res.data.fiche} - ${res.data.program}`;
        generateCalendar();
      }
    });
  } else {
    let data = {
      environment: environment.value.value,
      fstart: fStart.value,
      fend: fEnd.value,
    };
    await useStoreReport.generateReportByEnver(data).then((res) => {
      if (res.status <= 201) {
        months.value = res.data.months;
        yearsMonth.value = res.data.yearsMonth;
        eventsCalender.value = res.data.events;
        nameEnvironment.value = res.data.environment;
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
  if (shift.toLocaleLowerCase() == 'jornada mañana') {
    return {
      backgroundColor: '#FFE87C',
      borderColor: '#FFE87C',
      textColor: '#000000',
    };
  } else if (shift.toLocaleLowerCase() == 'jornada tarde') {
    return {
      backgroundColor: '#FF8C42',
      borderColor: '#FF8C42',
      textColor: '#FFFFFF',
    };
  } else {
    return {
      backgroundColor: '#1C1C3A',
      borderColor: '#1C1C3A',
      textColor: '#FFFFFF',
    };
  }
}

function addTimeSlotDivisions() {
  nextTick(() => {
    document.querySelectorAll('.fc-daygrid-day-frame').forEach((dayEl) => {
      if (!dayEl.querySelector('.franja')) {
        // Obtener la fecha del día actual
        const dayElement = dayEl.closest('.fc-daygrid-day');
        const dateStr = dayElement?.getAttribute('data-date');

        if (!dateStr) return;

        // Buscar eventos para esta fecha específica
        const eventsForDay = getEventsForDate(dateStr);

        // Verificar qué franjas horarias tienen eventos
        const hasEventInMorning = hasEventsInTimeSlot(eventsForDay, 'morning');
        const hasEventInAfternoon = hasEventsInTimeSlot(
          eventsForDay,
          'afternoon'
        );
        const hasEventInNight = hasEventsInTimeSlot(eventsForDay, 'night');

        // Generar estilos dinámicos para cada franja
        const morningStyle = getMorningStyle(hasEventInMorning);
        const afternoonStyle = getAfternoonStyle(hasEventInAfternoon);
        const nightStyle = getNightStyle(hasEventInNight);

        const morningText = hasEventInMorning ? '' : 'Disponible';
        const afternoonText = hasEventInAfternoon ? '' : 'Disponible';
        const nightText = hasEventInNight ? '' : 'Disponible';

        // Insertar las divisiones con estilos condicionales
        dayEl.insertAdjacentHTML(
          'beforeend',
          `
            <div class="franja franja-morning" style="${morningStyle}">${morningText}</div>
            <div class="franja franja-afternoon" style="${afternoonStyle}">${afternoonText}</div>
            <div class="franja franja-night" style="${nightStyle}">${nightText}</div>
          `
        );
      }
    });
  });
}

function getEventsForDate(dateStr) {
  const targetDate = new Date(dateStr);
  const allEvents = [];

  // Recorrer todos los meses en eventsCalender
  if (eventsCalender.value) {
    Object.values(eventsCalender.value).forEach((monthEvents) => {
      if (Array.isArray(monthEvents)) {
        monthEvents.forEach((event) => {
          const eventDate = new Date(event.start || event.date);
          // Comparar solo año, mes y día
          if (
            eventDate.getFullYear() === targetDate.getFullYear() &&
            eventDate.getMonth() === targetDate.getMonth() &&
            eventDate.getDate() === targetDate.getDate()
          ) {
            allEvents.push(event);
          }
        });
      }
    });
  }

  return allEvents;
}

// Función para verificar si hay eventos en una franja horaria específica
function hasEventsInTimeSlot(events, timeSlot) {
  return events.some((event) => {
    const eventTimeSlot = getEventTimeSlot(
      event.tstart || event.extendedProps?.tstart
    );
    return eventTimeSlot === timeSlot;
  });
}

// Función para determinar la franja horaria de un evento
function getEventTimeSlot(timeText) {
  if (!timeText) return null;

  const regex = /(\d{1,2}):(\d{2})\s*(A\.M\.|P\.M\.)/i;
  const match = timeText.match(regex);

  if (!match) return null;

  let hour = parseInt(match[1]);
  const period = match[3].toUpperCase();

  // Convertir a formato 24 horas
  if (period === 'P.M.' && hour !== 12) {
    hour += 12;
  } else if (period === 'A.M.' && hour === 12) {
    hour = 0;
  }

  // Determinar franja horaria
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'night';
  }
}

// Funciones para generar estilos de cada franja
function getMorningStyle(hasEvent) {
  const baseStyle =
    'position: absolute; top: 0; left: 0; width: 100%; height: 33.33%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: #b9b9b9;';

  if (hasEvent) {
    return `${baseStyle}
      background-color: #FFE87C4D;
      border: 2px solid #FFE87C;
      box-shadow: inset 0 0 10px #FFE87C80;`;
  } else {
    return `${baseStyle}
      background-color: #FFE87C1A;
      border: 1px dashed #b2b2b2;`;
  }
}

function getAfternoonStyle(hasEvent) {
  const baseStyle =
    'position: absolute; top: 33.33%; left: 0; width: 100%; height: 33.33%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: #b9b9b9;';

  if (hasEvent) {
    return `${baseStyle}
      background-color: rgba(255, 140, 66, 0.3);
      border: 2px solid #FF8C42;
      box-shadow: inset 0 0 10px rgba(255, 140, 66, 0.5);`;
  } else {
    return `${baseStyle}
      background-color: #FFE87C1A;
      border: 1px dashed #b2b2b2;`;
  }
}

function getNightStyle(hasEvent) {
  const baseStyle =
    'position: absolute; top: 66.66%; left: 0; width: 100%; height: 33.33%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: #b9b9b9;';

  if (hasEvent) {
    return `${baseStyle}
      background-color: rgba(28, 28, 58, 0.3);
      border: 2px solid #1C1C3A;
      box-shadow: inset 0 0 10px rgba(28, 28, 58, 0.5);`;
  } else {
    return `${baseStyle}
      background-color: #FFE87C1A;
      border: 1px dashed #b2b2b2;`;
  }
}

function getShiftClass(observation) {
  if (!observation) return 'unknown-shift';

  const lowerObs = observation.toLowerCase();

  if (lowerObs.includes('mañana')) return 'morning-shift';
  if (lowerObs.includes('tarde')) return 'afternoon-shift';
  if (lowerObs.includes('noche')) return 'night-shift';

  return 'unknown-shift'; // fallback si no reconoce
}
</script>

<style>
#calender {
  width: 1000px !important;
  height: 665px !important;
}

/* .item {
  align-self: center;
  border: 1px solid #00a91c;
  width: 800px;
} */

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
  background-color: #ffe87c;
}

.legend-item.afternoon .legend-color {
  background-color: #ff8c42;
}

.legend-item.night .legend-color {
  background-color: #1c1c3a;
}

.fc-daygrid-day-frame {
  position: relative; /* Cambio de absolute a relative */
}

.franja {
  position: absolute;
  left: 0;
  width: 100%;
  height: 33.33%;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

#franjam {
  top: 0;
  background-color: rgba(255, 255, 0, 0.1);
}

#franjat {
  top: 33.33%;
  background: rgba(0, 255, 0, 0.1);
}

#franjan {
  top: 66.66%;
  background: rgba(0, 0, 255, 0.1);
}

.fc-daygrid-body tr {
  height: 111.04px; /* ajusta según tu diseño */
}

.fc-event.morning-shift {
  transform: translateY(-22px);
  z-index: 1;
}

.fc-event.afternoon-shift {
  transform: translateY(0px);
  z-index: 1;
}

.fc-event.night-shift {
  transform: translateY(5px);
  z-index: 1;
}
</style>
