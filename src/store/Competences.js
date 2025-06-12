import { defineStore } from "pinia";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeComp = defineStore("storeCompt", () => {
  const userStore = storeUser();

  // Functions
  //get all competences
  const getComp = async () => {
    try {
      return await requestAxios.get("/competences", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener las competencias");
    }
  };

  //get competences by program
  const getCompetencesByProgram = async (idProgram) => {
    try {
      return await requestAxios.get(`/competences/program/${idProgram}`, {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener las competencias");
    }
  };

  // get competences active
  const getCompetenceActive = async () => {
    try {
      const { data } = await requestAxios.get("/competences?status=0", {
        headers: {
          token: userStore.token,
        },
      });

      return data;
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener las competencias");
    }
  };

  // post competence
  const postComp = async (infoComp) => {
    try {
      const response = await requestAxios.post(
        "/competences/register",
        infoComp,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Competencia guardada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  // edit competence how active
  const active = async (id) => {
    try {
      const activeCompetence = await requestAxios.put(
        `/competences/active/${id}`,
        null,
        {
          headers: {
            token: userStore.token,
          },
        }
      );

      notifySuccessRequest("Competencia activada correctamente");
      return activeCompetence;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  // edit competence how inactive
  const inactive = async (id) => {
    try {
      const inactiveCompetence = await requestAxios.put(
        `/competences/inactive/${id}`,
        null,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Competencia desactivada correctamente");
      return inactiveCompetence;
    } catch (error) {
      notifySuccessRequest(error.response.data.errors.join(", "));
    }
  };

  const updateComp = async (id, infoFiches) => {
    try {
      let response = await requestAxios.put(
        `/competences/update/${id}`,
        infoFiches,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Competencia actualizada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  return {
    getComp,
    getCompetenceActive,
    postComp,
    active,
    inactive,
    getCompetencesByProgram,
    updateComp,
  };
});
