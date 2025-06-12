import { defineStore } from "pinia";
import { ref } from "vue";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeProg = defineStore("storeProg", () => {
  const userStore = storeUser();

  // Functions
  const getPrograms = async () => {
    try {
      return await requestAxios.get("/programs", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener las competencias");
    }
  };

  const postPrograms = async (infoPrograms) => {
    try {
      let data = await requestAxios.post("/programs/register", infoPrograms, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Programa registrado correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const active = async (id) => {
    try {
      await requestAxios.put(`/programs/active/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Programa activado correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const inactive = async (id) => {
    try {
      await requestAxios.put(`/programs/inactive/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Programa desactivado correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const getProgramsActive = async () => {
    try {
      const { data } = await requestAxios.get(`/programs?status=0`, {
        headers: {
          token: userStore.token,
        },
      });

      return data;
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener los programas activos");
    }
  };

  const updateProgram = async (id, infoProgram) => {
    try {
      let data = await requestAxios.put(`/programs/update/${id}`, infoProgram, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Programa actualizado correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  return {
    getPrograms,
    postPrograms,
    active,
    inactive,
    getProgramsActive,
    updateProgram,
  };
});
