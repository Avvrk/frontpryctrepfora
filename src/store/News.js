import { defineStore } from "pinia";
import { ref } from "vue";
import { requestAxios } from "../common/axios";
import { storeUser } from "./users.js";
import { notifyErrorRequest, notifySuccessRequest } from "../common/notify";
import { storeReport } from "./Reports.js";

export const storeNews = defineStore("storeNews", () => {
  const userStore = storeUser();


  const getNews = async () => {
    const ahora = new Date()
    console.log(ahora);
    
    try {
      
      const data = await requestAxios.get("/news", {
        headers: {
          token: userStore.token,
        },
      }); 
      const despues = new Date()
      const tiempo = despues-ahora
      console.log(despues);
      console.log("tiempo transcurrido "+tiempo+" ms");
      
      console.log(data);
      return data;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const getNewsOnlyProcced = async () => {
    try {
      const data = await requestAxios.get("/news/onlyprocessed", {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest("No fue posible obtener las novedades");
    }
  };
  const getNewsOnlyProccedNullActa = async () => {
    try {
      const data = await requestAxios.get("/news/onlyprocessedactanull", {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest("No fue posible obtener las novedades");
    }
  };

  const getNewId = async (id) => {
    try {
      const data = await requestAxios.get(`/news/${id}`, {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest("No fue posible obtener las novedad");
      console.log(error);
    }
  };

  const getNewsByInstructor = async () => {
    try {
      const useReport = storeReport();
      const { value } = useReport.newConsult;
      console.log(value);

      const data = await requestAxios.get(`/news/newbyinstructor/${value}`, {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest("No fue posible obtener las novedades");
      console.log(error);
    }
  };

  const aproveNew = async (id) => {
    try {
      const useReport = storeReport();
      const { value } = useReport.newConsult;
      const dataPut = {
        newid: id,
        instr: value,
      };

      const data = await requestAxios.put(`/news/aprovenew`, dataPut, {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
      console.log(error);
    }
  };

  const notAproveNew = async (id) => {
    try {
      const useReport = storeReport();
      const { value } = useReport.newConsult;
      const dataPut = {
        newid: id,
        instr: value,
      };

      const data = await requestAxios.put(`/news/notaprovenew`, dataPut, {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
      console.log(error);
    }
  };

  const getAllImprovement = async () => {
    try {
      const data = await requestAxios.get(`/news/onlyimprovement`, {
        headers: {
          token: userStore.token,
        },
      });
      return data;
    } catch (error) {
      notifyErrorRequest("No fue posible obtener los planes de mejoramiento");
    }
  };

  const postNew = async (infoFiche) => {
    userStore.token=userStore.getRole=="USER"?userStore.token2:userStore.token
    console.log("token "+userStore.token);
    console.log("token2 "+userStore.token2);
    console.log(infoFiche);
    try {
      let response = await requestAxios.post("/news/register", infoFiche, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Novedad registrada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
      console.log(error.response.data);
    }
  };

  const postImprovement = async (infoImprovement) => {
    try {

      let response = await requestAxios.post(
        "/news/registerimprovement",
        infoImprovement,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Plan de mejoramiento registrado");
      return response;
    } catch (error) {
      console.log(error);
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const registerPublicNew = async (infoFiche) => {
    try {
      let response = await requestAxios.post(
        "/news/registerpublic",
        infoFiche,
        {}
      );
      notifySuccessRequest("Novedad registrada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const activeNew = async (id) => {
    try {
      const response = await requestAxios.put(`/news/active/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Novedad activada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const inactiveNew = async (id) => {
    try {
      const response = await requestAxios.put(`/news/inactive/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Novedad desactivada correctamente");
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const updateNew = async (id, infoNew) => {
    userStore.token=userStore.getRole=="USER"?userStore.token2:userStore.token
    console.log("token "+userStore.token);
    console.log("token2 "+userStore.token2);
    try {
      let response = await requestAxios.put(`/news/update/${id}`, infoNew, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Novedad actualizada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(error.response.data.msg);
      console.log(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
      return error
    }
  };

  const updateMultiplesNews = async (infoNews) => {
    try {
      let response = await requestAxios.put("/news/updatemultiple", infoNews, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Novedades actualizadas correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const updateAdvancedNew = async (id, infoNew) => {
    try {
      let response = await requestAxios.put(
        `/news/updateadvanced/${id}`,
        infoNew,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Novedad actualizada correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const updateImprovement = async (id, infoImprovement) => {
    try {
      let response = await requestAxios.put(
        `/news/updateimprovement/${id}`,
        infoImprovement,
        {
          headers: {
            token: userStore.token,
          },
        }
      );
      notifySuccessRequest("Plan de mejoramiento actualizado");
      return response;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  //migrar aplazamientos
  const upgradeNews = async (news) => {
    try {
      let response = await requestAxios.put(`/news/upgradepostpone`, news, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Novedades actualizadas correctamente");
      return response;
    } catch (error) {
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  const notifyNew = async (id) => {
    try {
      let response = await requestAxios.put(`/news/sendemail/${id}`, null, {
        headers: {
          token: userStore.token,
        },
      });
      notifySuccessRequest("Novedad notificada correctamente");
      return response;
    } catch (error) {
      console.log(error);
      notifyErrorRequest(!error.response.data.errors?error.response.data.msg:error.response.data.errors[0]);
    }
  };

  return {
    getNews,
    getNewId,
    getNewsOnlyProcced,
    getNewsOnlyProccedNullActa,
    getNewsByInstructor,
    aproveNew,
    notAproveNew,
    getAllImprovement,
    postNew,
    postImprovement,
    registerPublicNew,
    activeNew,
    inactiveNew,
    notifyNew,
    updateNew,
    updateMultiplesNews,
    updateAdvancedNew,
    upgradeNews,
    updateImprovement,
  };
});
