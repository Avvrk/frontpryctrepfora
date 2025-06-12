import { defineStore } from "pinia";
import { ref } from "vue";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import {
  notifyErrorRequest,
  notifySuccessRequest,
  notifyWarningRequest,
} from "../common/notify";

export const storeOtherSche = defineStore("storeOtherSche", () => {
  const userStore = storeUser();

  const getOtherSchedules = async () => {
    try {
      const { data } = await requestAxios.get("/othersschedules", {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      return error;
    }
  };

  const getScheduleByInstructor = async (instructor) => {
    try {
      const { data } = await requestAxios.get(
        `/othersschedules/instructor/${instructor}`,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      return data;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const getOtherScheduleById = async (id) => {
    try {
      const resp = await requestAxios.get(`/othersschedules/${id}`, {
        headers: {
          token: userStore.token,
        },
      });
      return resp;
    } catch (error) {}
  };

  const postOtherSchedules = async (infoSche) => {
    try {
      const data = await requestAxios.post(
        "/othersschedules/register",
        infoSche,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Programación guardada correctamente");

      return data;
    } catch (error) {
      
      
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
      return error;
    }
  };

  const validateOtherSchedule = async (infoSche) => {
    try {
      const validate = await requestAxios.post(
        "/othersschedules/validateschedule",
        infoSche,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      if (validate.data.msg) {
        notifyWarningRequest(validate.data.msg);
      }
      return validate;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const putOtherSchedules = async (id, infoSche) => {
    try {
      const data = await requestAxios.put(
        `/othersschedules/update/${id}`,
        infoSche,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Programación actualizada correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
      return error;
    }
  };

  const validateEditOtherSchedule = async (id, infoSche) => {
    try {
      const validate = await requestAxios.post(
        `/othersschedules/validateeditschedule/${id}`,
        infoSche,
        {
          headers: {
            token: userStore.token,
          },
        }
      );

      if (validate.data.msg) {
        notifyWarningRequest(validate.data.msg);
      }
      return validate;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const activarOtherSchedule = async (id) => {
    console.log(id);
    
    try {
      const resp = await requestAxios.put(
        `/othersschedules/active/${id}`,
        null,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      console.log(resp);
      
      return resp;
    } catch (error) {
      console.log(error);
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const inactiveOtherSchedule = async (id) => {
    try {
      const resp = await requestAxios.put(
        `/othersschedules/inactive/${id}`,
        null,
        {
          headers: {
            token: userStore.token,
          },
        }
      );

      return resp;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const deleteEvent = async (id, date) => {
    try {
      await requestAxios.put(
        `/othersschedules/deleteevent/${id}`,
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
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  return {
    getOtherSchedules,
    getScheduleByInstructor,
    postOtherSchedules,
    getOtherScheduleById,
    validateOtherSchedule,
    putOtherSchedules,
    validateEditOtherSchedule,
    activarOtherSchedule,
    inactiveOtherSchedule,
    deleteEvent,
  };
});
