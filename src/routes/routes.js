import Login from "../views/Login.vue";
import Mantenimiento from "../views/Mantenimiento.vue";
import Home from "../views/Home.vue";
import HomeInstructor from "../views/Instructors.vue";
import HomeCompetences from "../views/Competences.vue";
import HomeEnvironments from "../views/Environments.vue";
import HomeFiles from "../views/Files.vue";
import HomePrograms from "../views/Programs.vue";
import HomeResults from "../views/Results.vue";
import newSchedule from "../views/NewSchedule.vue";
import homeSchedules from "../views/HomeSchedules.vue";
import TableSchedules from "../views/Schedules.vue";
import Programming from "../views/Programming.vue";
import HomeConsult from "../views/Reports.vue";
import Typeconsult from "../views/Consult.vue";
import testPage from "../views/test.vue";
import Users from "../views/Users.vue";
import Coordination from "../views/Coordination.vue";
import otherSchedule from "../views/OtherSchedule.vue";
import newOtherSchedule from "../views/NewOtherSchedule.vue";
import Judgment from "../views/Judgment.vue";
import forgotPassword from "../views/ForgotPassword.vue";
import resetPassword from "../views/ResetPassword.vue";
import bulkload from "../views/Bulkload.vue";
import Binnacle from "../views/Binnacle.vue";
import HomeNews from "../views/News.vue";
import RegisterNew from "../views/RegisterNew.vue";
import ReportsNews from "../components/News/reportNew.vue";
import HomeInstructorView from "../views/HomeInstructors.vue";
import NewByInstructor from "../views/NewByInstructor.vue";
import ImprovementByInstructor from "../views/ImprovementByInstructor.vue";
import ReportHoursInstruc from "../views/ReporteHoursIntructor.vue";
import Test from "../views/Consult2.0.vue";
import Test2 from "../views/Consult3.0.vue";
import { useRouter } from "vue-router";
import { storeUser } from "../store/users.js";

const checkAuth = () => {
  const userStore = storeUser();
  const token = userStore.token;

  if (userStore.dateLogin == "" || userStore.dateLogin == undefined)
    return false;
  const dateLogin = userStore.dateLogin.split("T")[0];
  const dateNow = new Date().toISOString().split("T")[0];

  if (dateLogin !== dateNow || !token) return false;
  return true;
};

const auth = (to, from, next) => {
  if (checkAuth()) {
    const userStore = storeUser();
    const userRole = userStore.getRole();

    if (!to.meta.rol.includes(userRole)) {
      userStore.logoutUser();
      return next({ name: "login" });
    }
    next();
  } else {
    next({ name: "login" });
  }
};

let router = useRouter();
export const routes = [
  /*   {
    path: "/",
    name: "login",
    component: Mantenimiento,
  }, */

  {
    path: "/",
    name: "login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (checkAuth()) {
        next({ name: "home" });
      } else {
        next();
      } 
      //location.href = 'https://repforacat.com'
    },
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR", "EVALUADOR","NOVEDADES"],
    },
    beforeEnter: auth,
  },
  {
    path: "/home/instructor",
    name: "homeInstructor",
    component: HomeInstructorView,
    meta: {
      rol: ["USER", "PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/instructors",
    name: "instructors",
    component: HomeInstructor,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/competences",
    name: "competences",
    component: HomeCompetences,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/environments",
    name: "environments",
    component: HomeEnvironments,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/files",
    name: "files",
    component: HomeFiles,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/programs",
    name: "programs",
    component: HomePrograms,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/results",
    name: "results",
    component: HomeResults,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/schedules",
    name: "schedules",
    component: TableSchedules,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/editSchedule/:id",
    name: "editSchedule",
    component: newSchedule,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/newSchedule",
    name: "newSchedule",
    component: newSchedule,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/homeSchedules",
    name: "homeSchedules",
    component: homeSchedules,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/reports",
    name: "reports",
    component: HomeConsult,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/programacion/:token",
    name: "progrmacion",
    component: Programming,
  },
  {
    path: "/consultor",
    name: "consultor",
    component: HomeConsult,
    meta: {
      rol: ["USER"],
    },
    beforeEnter: auth,
  },
  {
    path: "/tipoConsultaTEST/:opcion",
    name: "tipoConsultaTEST",
    component: Test2,
    meta: {
      rol: ["USER", "PROGRAMADOR", "COORDINADOR"]
    },
    beforeEnter: auth,
  },
  {
    path: "/tipoConsulta/:opcion",
    name: "tipoConsulta",
    component: Typeconsult,
    meta: {
      rol: ["USER", "PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
   {
    path: "/reportehours",
    name: "reportehours",
    component: ReportHoursInstruc,
    meta: {
      rol: ["USER", "PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/otherSchedule",
    name: "otherSchedule",
    component: otherSchedule,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/newOtherSchedule",
    name: "newOtherSchedule",
    component: newOtherSchedule, //newOtherSchedule
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/editOtherSchedule/:id",
    name: "editOtherSchedule",
    component: newOtherSchedule,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/bulkload",
    name: "bulkload",
    component: bulkload,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/judgment",
    name: "Judgment",
    component: Judgment,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR", "EVALUADOR", "NOVEDADES"],
    },
    beforeEnter: auth,
  },
  {
    path: "/news",
    name: "News",
    component: HomeNews,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR","NOVEDADES"],
    },
    beforeEnter: auth,
  },
  {
    path: "/news/reports",
    name: "ReportsNews",
    component: ReportsNews,
    meta: {
      rol: ["PROGRAMADOR", "COORDINADOR","NOVEDADES"],
    },
    beforeEnter: auth,
  },
  {
    path: "/new/instructor",
    name: "newByInstructor",
    component: NewByInstructor,
    meta: {
      rol: ["USER", "PROGRAMADOR", "COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/users",
    name: "users",
    component: Users,
    meta: {
      rol: ["COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/coordination",
    name: "coordination",
    component: Coordination,
    meta: {
      rol: ["COORDINADOR"],
    },
    beforeEnter: auth,
  },
  {
    path: "/binnacle",
    name: "binnacle",
    component: Binnacle,
    meta: {
      rol: ["COORDINADOR"],
    },
    beforeEnter: auth,
  },

  {
    path: "/forgotPassword",
    name: "forgotPassword",
    component: forgotPassword,
  },
  {
    path: "/resetpassword/:token",
    name: "resetpassword",
    component: resetPassword,
  },
  {
    path: "/test",
    name: "test",
    component: testPage,
  },
  {
    path: "/registernew/form",
    name: "registernew",
    component: RegisterNew,
  },

  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];
