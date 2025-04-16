import axios from 'axios';

const API_BASE_URL = 'https://image-hosting.kuncipintu.my.id';  // Ubah base URL menjadi tanpa '/api'

const photoService = {
  getUserPhotos: (userId, page = 1) =>
    axios.get(`${API_BASE_URL}/photos/user/${userId}?page=${page}`)  // Sesuaikan endpoint
};

export default photoService;
