/* =====================================================
   Models Index
   ===================================================== */

/**
 * @file index.js
 * @description Centralny punkt importu wszystkich modeli Mongoose.
 *              Pozwala wczytać wszystkie modele naraz, co ułatwia import w kontrolerach i serwerze.
 */

/* =====================================================
   MODELS
   ===================================================== */
require('./user.model');       // Model użytkowników
require('./anime.model');      // Model anime
require('./character.model');  // Model postaci
require('./season.model');     // Model sezonów anime
require('./review.model');     // Model recenzji
require('./userAnime.model');  // Model relacji użytkownik–anime

/* =====================================================
   NOTE
   ===================================================== */
// Plik nie eksportuje niczego – jego celem jest tylko inicjalizacja wszystkich modeli.
// Dzięki temu w kontrolerach możemy używać mongoose.model("User"), mongoose.model("Anime") itd.