import { defineStore } from "pinia";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeBinnacle = defineStore("storeBinnacle", () => {
  const userStore = storeUser();

  // Functions
  const listInitLog = async () => {
    try {
      const response = await requestAxios.get("/binnacle", {
        headers: {
          token: userStore.token,
        },
      });

      return response;
    } catch (error) {
      notifyErrorRequest("No se pudo obtener la bitácora");
    }
  };

  const listFilterLog = async (data) => {
    try {
      const response = await requestAxios.post(
        "/binnacle/filterbinnacle",
        data,
        {
          headers: {
            token: userStore.token,
          },
        }
      );

      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };
  return {
    listInitLog,
    listFilterLog,
  };
});
