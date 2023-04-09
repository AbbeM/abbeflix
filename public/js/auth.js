/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
import jwt_decode from 'jwt-decode';

// const currentUserId = jwt_decode(localStorage.getItem('jwt')).user.id;

const token = localStorage.getItem('jwt'); // Hämta JWT-token från localStorage
// const decoded = jwt_decode(token); // Avkoda JWT-token för att hämta användarens uppgifter, inklusive ID
// const currentUserId = decoded.user.id; 

console.log(`user: ${token}`);

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

      addBtn.textContent = 'Ta Bort'

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

export const rateMovie = async (movieId, user, rating) => { 
  try {
    // Hämta recensioner för filmen
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/movies/${movieId}/reviews`,
    });

    // Kolla om användaren har betygsatt filmen tidigare
    const review = res.data.data.docs.find(review => review.user === user);

    // Om användaren har betygsatt filmen, skicka en PATCH-förfrågan
    // för att uppdatera betyget. Annars, skicka en POST-förfrågan
    if (review) {
      const updateRes = await axios({
        method: 'PATCH',
        url: `http://127.0.0.1:8000/api/v1/movies/${movieId}/reviews/${review.id}`,
        data: { rating },
      });
      
      if (updateRes.data.status === 'success') {
        showAlert('success', 'Rating updated');
      }
    } else {
      const createRes = await axios({
        method: 'POST',
        url: `http://127.0.0.1:8000/api/v1/movies/${movieId}/reviews`,
        data: { rating },
      });
      
      if (createRes.data.status === 'success') {
        showAlert('success', 'Rated');
      }
    }

  } catch (err) {
    showAlert('error', err.message);
  }
}
