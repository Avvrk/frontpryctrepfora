import { defineStore } from "pinia";
import { ref } from "vue";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import {
  notifyErrorRequest,
  notifySuccessRequest,
  notifyWarningRequest,
} from "../common/notify";

export const storeSche = defineStore("storeSche", () => {
  const userStore = storeUser();

  const getSchedules = async () => {
    try {
      const { data } = await requestAxios.get("/schedules", {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      return error;
    }
  };

  const getScheduleByFiche = async (fiche) => {
    try {
      const { data } = await requestAxios.get(`/schedules/fiche/${fiche}`, {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const getScheduleById = async (id) => {
    try {
      const resp = await requestAxios.get(`/schedules/${id}`, {
        headers: {
          token: userStore.token,
        },
      });
      return resp;
    } catch (error) {}
  };

  const postSchedules = async (infoSche) => {
    try {
      const data = await requestAxios.post("/schedules/register", infoSche, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Programación guardada correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
      return error;
    }
  };

  const validateSchedule = async (infoSche) => {
    try {
      const validate = await requestAxios.post(
        "/schedules/validateschedule",
        infoSche,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      console.log(validate);

      if (validate.data.msg) {
        if (validate.data.msg.errorSchedule)
          notifyWarningRequest(validate.data.msg.errorSchedule);
        if (validate.data.msg.errorEnvirontment)
          notifyWarningRequest(validate.data.msg.errorEnvirontment);
      }
      return validate;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
      return error;
    }
  };

  const putSchedules = async (id, infoSche) => {
    try {
      const data = await requestAxios.put(`/schedules/update/${id}`, infoSche, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Programación actualizada correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
      return error;
    }
  };

  const validateEditSchedule = async (id, infoSche) => {
    try {
      const validate = await requestAxios.post(
        `/schedules/validateeditschedule/${id}`,
        infoSche,
        {
          headers: {
            token: userStore.token,
          },
        }
      );

      if (validate.data.msg) {
        if (validate.data.msg.errorSchedule)
          notifyWarningRequest(validate.data.msg.errorSchedule);
        if (validate.data.msg.errorEnvirontment)
          notifyWarningRequest(validate.data.msg.errorEnvirontment);
      }
      return validate;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
      return error;
    }
  };

  const activarSchedule = async (id) => {
    try {
      const resp = await requestAxios.put(`/schedules/active/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });

      return resp;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const inactiveSchedule = async (id) => {
    try {
      const resp = await requestAxios.put(`/schedules/inactive/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });

      return resp;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const deleteEvent = async (id, date) => {
    try {
      await requestAxios.put(
        `/schedules/deleteevent/${id}`,
        {
          event: date,
        },
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Evento eliminado correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  return {
    getSchedules,
    getScheduleByFiche,
    postSchedules,
    getScheduleById,
    validateSchedule,
    putSchedules,
    validateEditSchedule,
    activarSchedule,
    inactiveSchedule,
    deleteEvent,
  };
});
