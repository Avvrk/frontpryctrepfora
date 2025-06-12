import { defineStore } from "pinia";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeTowns = defineStore("storeTowns", () => {
  const userStore = storeUser();

  // Functions
  const getTown = async () => {
    try {
      return await requestAxios.get("/towns?status=0", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener los municipios");
    }
  };

  const getDeparta = async () => {
    try {
      const dataDeparta = await requestAxios.get("/towns/departaments", {
        headers: {
          token: userStore.token,
        },
      });
      return dataDeparta;
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener los departamentos");
    }
  };

  const getTownsByDeparta = async (departament) => {
    try {
      return await requestAxios.get(`/towns/towns/${departament}`, {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener los municipios");
    }
  };

  const postTown = async (infoTown) => {
    try {
      await requestAxios.post("/towns/register", infoTown, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Municipios registrados correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  return {
    getTown,
    postTown,
    getDeparta,
    getTownsByDeparta,
  };
});
