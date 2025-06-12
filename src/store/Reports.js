import { defineStore } from "pinia";
import { ref } from "vue";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeReport = defineStore(
  "storeReport",
  () => {
    const userStore = storeUser();

    // State
    let newConsult = ref("");

    // Functions
    const generateReport = async (data) => {
      try {
        const resp = await requestAxios.post("/reports", data, {
          headers: {
            token: userStore.token,
          },
        });
        return resp;
      } catch (error) {
        notifyErrorRequest(error.response.data.msg);
        return error;
      }
    };

    const generateReportByInstr = async (data) => {
      try {
        const resp = await requestAxios.post("/reports/instructor", data, {
          headers: {
            token: userStore.token,
          },
        });
        return resp;
      } catch (error) {
        notifyErrorRequest(error.response.data.msg);
        return error;
      }
    };

    const generateReportByEnver = async (data) => {
      try {
        const resp = await requestAxios.post("/reports/environment", data, {
          headers: {
            token: userStore.token,
          },
        });
        return resp;
      } catch (error) {
        notifyErrorRequest(error.response.data.msg);
        return error;
      }
    };

    const generateTempReport = async (data) => {
      try {
        const resp = await requestAxios.post("/reports/reporttemp", data, {});

        return resp;
      } catch (error) {
        notifyErrorRequest(error.response.data.msg);
        return error;
      }
    };

    const sendReport = async (data) => {
      try {
        await requestAxios.post("/reports/sendreport", data, {
          headers: {
            token: userStore.token,
          },
        });
        notifySuccessRequest("Programación enviada correctamente");
      } catch (error) {
        notifyErrorRequest(error.response.data.msg);
        return error;
      }
    };

    // is role USER
    const existInstructor = async (object) => {
      try {
        const { data, status } = await requestAxios.post(
          "/reports/validateinst",
          object,
          {
            headers: {
              token: userStore.token,
            },
          }
        );

        newConsult.value = {
          label: data.instructor.numdocument,
          value: data.instructor._id,
        };
        
        userStore.token2 =data.token
        console.log(userStore.token2);
        console.log(data.token);
        return status;
      } catch (error) {
        console.log(error);
        notifyErrorRequest(error.response.data.errors.join(", "));
      }
      
    };

    const existFiche = async (object) => {
      try {
        const { data, status } = await requestAxios.post(
          "/reports/validatefiche",
          object,
          {
            headers: {
              token: userStore.token,
            },
          }
        );

        newConsult.value = {
          label: data.fiche[0].number,
          value: data.fiche[0]._id,
        };

        return status;
      } catch (error) {
        notifyErrorRequest(error.response.data.errors.join(", "));
      }
    };


    const reportHoursIns = async (data) => {
      try {
        const resp = await requestAxios.post("/reports/hoursinstructors", data, {
          headers: {
            token: userStore.token,
          },
        });
        return resp.data;
      } catch (error) {
        notifyErrorRequest(error.response.data?.msg);
        return error;
      }
    }

    const cleanConsult = () => {
      newConsult.value = "";
    };

    return {
      newConsult,
      generateReport,
      sendReport,
      generateTempReport,
      generateReportByInstr,
      generateReportByEnver,
      existInstructor,
      existFiche,
      reportHoursIns,
      cleanConsult,
    };
  },
  {
    persist: true,
  }
);
