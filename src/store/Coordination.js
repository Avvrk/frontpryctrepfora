import { defineStore } from "pinia";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeCoor = defineStore("storeCoor", () => {
  const userStore = storeUser();

  // Functions
  const getCoordination = async () => {
    try {
      return await requestAxios.get("/coordinations", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener las coordinaciones");
    }
  };

  const postCoordination = async (infoCoordination) => {
    try {
      let data = await requestAxios.post(
        "/coordinations/register",
        infoCoordination,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Coordinación registrada correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const active = async (id) => {
    try {
      await requestAxios.put(`/coordinations/active/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Coordinación activada correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const inactive = async (id) => {
    try {
      await requestAxios.put(`/coordinations/inactive/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Coordinación desactivada correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const getCoordinationActive = async () => {
    try {
      const { data } = await requestAxios.get(`/coordinations?status=0`, {
        headers: {
          token: userStore.token,
        },
      });

      return data;
    } catch (error) {
      notifyErrorRequest(
        "No se fue posible obtener las coordinaciones activos"
      );
    }
  };

  const updateCoordination = async (id, infoProgram) => {
    try {
      let data = await requestAxios.put(
        `/coordinations/update/${id}`,
        infoProgram,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Coordinación actualizada correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  return {
    getCoordination,
    postCoordination,
    active,
    inactive,
    getCoordinationActive,
    updateCoordination,
  };
});
