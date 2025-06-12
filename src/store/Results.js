import { defineStore } from "pinia";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeResult = defineStore("storeResult", () => {
  const userStore = storeUser();

  const getResults = async () => {
    try {
      return await requestAxios.get("/outcomes", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No fue posible obtener los resultados");
    }
  };

  const getResultsByCompetence = async (idCompetence) => {
    try {
      return await requestAxios.get(`/outcomes/competence/${idCompetence}`, {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest(
        "No fue posible obtener la competencia de los resultados"
      );
    }
  };

  const postResults = async (infoRes) => {
    try {
      const result = await requestAxios.post("/outcomes/register", infoRes, {
        headers: {
          token: userStore.token,
        },
      });

      notifySuccessRequest(result.data.msg);
      return result;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const active = async (id) => {
    try {
      await requestAxios.put(`/outcomes/active/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Resultado activado correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const inactive = async (id) => {
    try {
      await requestAxios.put(`/outcomes/inactive/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Resultado desactivado correctamente");
    } catch (error) {
      return error;
    }
  };

  const updateResult = async (infoResult) => {
    try {
      let data = await requestAxios.put(`/outcomes/update`, infoResult, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Resultado actualizado correctmante");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const getResActive = async () => {
    try {
      const { data } = await requestAxios.get("/outcomes?status=0", {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Resultado activado correctmante");

      return data;
    } catch (error) {
      notifySuccessRequest(error.response.data.errors.join(", "));
    }
  };

  return {
    getResults,
    getResultsByCompetence,
    postResults,
    active,
    inactive,
    updateResult,
    getResActive,
  };
});
