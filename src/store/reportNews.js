import { defineStore } from "pinia";
import { requestAxios } from "../common/axios.js";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify.js";

export const storeReportNew = defineStore("storeReportNew", () => {
  const userStore = storeUser();

  // Functions
  const statisticsReport = async (data) => {
    try {
      const resp = await requestAxios.post("/reportnew/statistics", data, {
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

  const getReportActa = async (data) => {
    try {
      const resp = await requestAxios.post("/reportnew/acta", data, {
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

  const getReportTypeNew = async (data) => {
    try {
      const resp = await requestAxios.post("/reportnew/typenew", data, {
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

  const getReportImprovement = async (data) => {
    try {
      const resp = await requestAxios.post("/reportnew/typenew/improvement", data, {
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

  const getReportStatusNew = async (data) => {
    try {
      const resp = await requestAxios.post("/reportnew/status", data, {
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

  const getReportFiche = async (data) => {
    try {
      const resp = await requestAxios.post("/reportnew/fiche", data, {
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

  const getReportStudent = async (data) => {
    try {
      const resp = await requestAxios.post("/reportnew/student", data, {
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

  return {
    statisticsReport,
    getReportActa,
    getReportTypeNew,
    getReportImprovement,
    getReportStatusNew,
    getReportFiche,
    getReportStudent
  };
});
