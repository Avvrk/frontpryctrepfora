import { defineStore } from "pinia";
import { ref } from "vue";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeFiles = defineStore("storeFiles", () => {
  const userStore = storeUser();

  const getFiles = async () => {
    try {
      return await requestAxios.get("/fiches", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No fue posible obtener las fichas");
    }
  };

  const getFilesCoordination = async () => {
    try {
      return await requestAxios.get("/fiches/coordination", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No fue posible obtener las fichas");
    }
  };


  const getFilesPublic = async () => {
    try {
      return await requestAxios.get("/fiches/public", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No fue posible obtener las fichas");
    }
  };

  const getFilesActive = async () => {
    try {
      const res = await requestAxios.get("/fiches?status=0", {
        headers: {
          token: userStore.token,
        },
      });
      

      return res;
    } catch (error) {
      notifyErrorRequest("No fue posible obtener las fichas");
    }
  };

  const postFiles = async (infoFiche) => {
    try {
      let response = await requestAxios.post("/fiches/register", infoFiche, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Ficha registrada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const active = async (id) => {
    try {
      const response = await requestAxios.put(`/fiches/active/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Ficha activada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const inactive = async (id) => {
    try {
      const response = await requestAxios.put(`/fiches/inactive/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Ficha desactivada correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const listProgramsActive = async () => {
    try {
      const { data } = await requestAxios.get("/programs?status=0", {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener los programas");
    }
  };

  const updateFiche = async (id, infoFiches) => {
    try {
      let response = await requestAxios.put(
        `/fiches/update/${id}`,
        infoFiches,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Ficha actualizada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  return {
    getFiles,
    getFilesCoordination,
    postFiles,
    getFilesActive,
    getFilesPublic,
    active,
    inactive,
    listProgramsActive,
    updateFiche,
  };
});
