
/* =====================================================
   ADD CHARACTER PAGE
   ===================================================== */

/**
 * @file AddCharacter.js
 * @description Creates a character assigned to a specific anime.
 *              Character photos are not uploaded on this page.
 */

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "./AddCharacter.module.scss";
import Container from "../../common/container/Container";
import CharacterForm from "../../features/CharacterForm/CharacterForm";

import {
  createCharacterRequest,
} from "../../../redux/reducers/charactersRedux";

/* =====================================================
   ADD CHARACTER COMPONENT
   ===================================================== */

const AddCharacter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const animeId = searchParams.get("animeId");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     CREATE CHARACTER
     ===================================================== */

  const handleAddCharacter = async data => {
    if (!animeId) {
      setError("Cannot create a character without an anime ID.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const createdCharacter = await dispatch(
        createCharacterRequest({
          ...data,
          anime: animeId,
        })
      );

      navigate(`/character/${createdCharacter._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to add character."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =====================================================
     PAGE LAYOUT
     ===================================================== */

  if (!animeId) {
    return (
      <div className={styles.root}>
        <Container>
          <h1>Add new character</h1>
          <p className="text-danger">
            Anime ID is missing. Open this page from a specific anime.
          </p>
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Container>
        <h1>Add new character</h1>

        {error && (
          <p className="text-danger" role="alert">
            {error}
          </p>
        )}

        <CharacterForm
          animeId={animeId}
          onSubmit={handleAddCharacter}
          submitText="Add character"
          isSaving={isSaving}
          backTo={`/anime/${animeId}`}
        />
      </Container>
    </div>
  );
};

export default AddCharacter;
