import axios from "axios";

const API_URL = "http://localhost:8080/listas";

export default {
  listarTodos() {
    return axios.get(API_URL);
  },
  criar(lista) {
    return axios.post(API_URL, lista);
  },
  buscar(texto, descricao) {
    return axios.get(`${API_URL}/buscar`, {
      params: { texto, descricao }
    });
  }
};
