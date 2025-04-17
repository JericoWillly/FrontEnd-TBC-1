import axios from "axios";

const API_BASE_URL = "https://image-hosting.kuncipintu.my.id"; // Ubah base URL menjadi tanpa '/api'

const photoService = {
  getUserPhotos: (userId) =>
    axios.get(`${API_BASE_URL}/photos/user/${userId}`) // Sesuaikan endpoint
};

export default photoService;
