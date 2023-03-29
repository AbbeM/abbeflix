/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: { email, password }
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Du är inloggad!')
      window.location.replace('http://127.0.0.1:8000/');
    }
  } catch (err) {
    showAlert('error', 'inloggningen misslyckades')
  }

}

export const sigup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/signup',
      data: { name, email, password, passwordConfirm }
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Du är inloggad!')
      window.location.replace('http://127.0.0.1:8000/');
    }
  } catch (err) {
    showAlert('error', 'inloggningen misslyckades')
  }
}

export const logout = async () => { 
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout',
    });

    if(res.data.status == 'success') location.reload(true);

  } catch (err) {
    showAlert('error', 'misslyckades')
  }
}

export const addToFavorit = async (movieId, addBtn) => { 
  try {
    const favoritMovie = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/movies/${movieId}`,
    });

    if(!favoritMovie.data.data.isFavorite) {
      const res = await axios({
        method: 'POST',
        url: `http://127.0.0.1:8000/api/v1/movies/${movieId}/favorits`,
      });
  
      if(res.data.status == 'success') showAlert('success', 'Added to list')

      addBtn.textContent = 'Ta Bord'

    } else {
      await axios({
        method: 'DELETE',
        url: `http://127.0.0.1:8000/api/v1/movies/${movieId}/favorits`,
      });
  
      showAlert('success', 'Deleted from list')
      addBtn.textContent = 'Lägg Till'
    }

  } catch (err) {
    showAlert('error', 'misslyckades')
  }
}
