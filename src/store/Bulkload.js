import { defineStore } from "pinia";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";

export const storeBulkload = defineStore("storeBulkload", () => {
  const userStore = storeUser();

  // Functions
  const downloadTemplate = async (fileType) => {
    try {
      const response = await requestAxios.post(
        "/uploads/downloadexcel",
        fileType,
        {
          responseType: "blob", // Indicar que esperamos recibir un archivo binario
          headers: {
            token: userStore.token,
          },
        }
      );

      return response.data;
    } catch (error) {
      notifyErrorRequest("No se pudo descargar la plantilla");
    }
  };

  const uploadExcel = async (file, program) => {
    try {
      const response = await requestAxios.post(
        `/uploads/uploadexcel/${program}`,
        file,
        {
          headers: {
            token: userStore.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      notifySuccessRequest("Se ha cargado el archivo correctamente");
      return response.data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };

  const uploadExcelInstructors = async (file, program) => {
    try {
      const response = await requestAxios.post(
        "/uploads/uploadexcelinstructor",
        file,
        {
          headers: {
            token: userStore.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      notifySuccessRequest("Se ha cargado el archivo correctamente");
      return response.data;
    } catch (error) {
      notifyErrorRequest(error.response.data.errors.join(", "));
    }
  };
  return {
    downloadTemplate,
    uploadExcelInstructors,
    uploadExcel,
  };
});
