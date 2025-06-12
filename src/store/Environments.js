import { defineStore } from "pinia";
import { ref } from "vue";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeEnv = defineStore("storeEnv", () => {
  const userStore = storeUser();

  // Functions
  const getEnv = async () => {
    try {
      return await requestAxios.get("/environments", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener los ambientes");
    }
  };

  const getEnvActive = async () => {
    try {
      const { data } = await requestAxios.get("/environments?status=0", {
        headers: {
          token: userStore.token,
        },
      });

      return data;
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener los ambientes activos");
      return error;
    }
  };

  const postEnv = async (infoEnv) => {
    try {
      let data = await requestAxios.post("/environments/register", infoEnv, {
        headers: {
          token: userStore.token,
        },
      });

      notifySuccessRequest("Ambiente guardardo correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const active = async (id) => {
    try {
      const response = await requestAxios.put(
        `/environments/active/${id}`,
        null,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Ambiente activado correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const inactive = async (id) => {
    try {
      const response = await requestAxios.put(
        `/environments/inactive/${id}`,
        null,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Ambiente desactivado correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const updateEnv = async (id, infoEnv) => {
    try {
      let response = await requestAxios.put(
        `/environments/update/${id}`,
        infoEnv,
        {
          headers: {
            token: userStore.token,
          },
        }
      );

      notifySuccessRequest("Ambiente actualizado correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  return { getEnv, getEnvActive, postEnv, active, inactive, updateEnv };
});
