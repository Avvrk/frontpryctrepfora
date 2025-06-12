import { defineStore } from "pinia";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeJudgment = defineStore("storeJudgment", () => {
  const userStore = storeUser();
  const uploadFileJudgment = async (file) => {
    try {
      const response = await requestAxios.post(
        "/uploads/uploadexceljudgment",
        file,
        {
          headers: {
            token: userStore.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      notifyErrorRequest("No se fue posible obtener las competencias");
    }
  };

  return {
    uploadFileJudgment,
  };
});
