import { defineStore } from "pinia";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeInst = defineStore("storeInst", () => {
  const userStore = storeUser();

  // Functions
  const getInst = async () => {
    try {
      return await requestAxios.get("/instructors", {
        headers: {
          token: userStore.token,
        },
      });
    } catch (error) {
      notifyErrorRequest("No fue posible obtener los instructores");
    }
  };

  const postInst = async (infoInst) => {
    try {
      let data = await requestAxios.post("/instructors/register", infoInst, {
        headers: {
          token: userStore.token,
        },
      });

      notifySuccessRequest("Instructor guardado correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const active = async (id) => {
    try {
      await requestAxios.put(`/instructors/active/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Instructor activado correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const inactive = async (id) => {
    try {
      await requestAxios.put(`/instructors/inactive/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Instructor desactivado correctamente");
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const getInstructorActive = async () => {
    try {
      const { data } = await requestAxios.get("/instructors?status=0", {
        headers: {
          token: userStore.token,
        },
      });

      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const updateInstructor = async (id, infoInstru) => {
    try {
      let data = await requestAxios.put(
        `/instructors/update/${id}`,
        infoInstru,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Instructor actualizado correctamente");
      return data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  return {
    getInst,
    postInst,
    getInstructorActive,
    active,
    inactive,
    updateInstructor,
  };
});
