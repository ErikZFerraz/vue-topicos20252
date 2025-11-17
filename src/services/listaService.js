// src/services/listasService.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // URL do seu backend Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  listarTodos() {
    return api.get("/listas");
  },

  criar(listas) {
    return api.post("/listas", listas);
  },

  buscar(secao, dataHoraCriacao) {
    return api.get("/listas/busca", {
      params: { secao, dataHoraCriacao },
    });
  },
};
