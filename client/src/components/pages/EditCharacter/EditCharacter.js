
/* =====================================================
   EDIT CHARACTER PAGE
   ===================================================== */

/**
 * @file EditCharacter.js
 * @description Loads and edits an existing character.
 *              Text data and photo are updated independently.
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./EditCharacter.module.scss";
import Container from "../../common/container/Container";
import CharacterForm from "../../features/CharacterForm/CharacterForm";
import ImageUpload from "../../features/ImageUpload/ImageUpload";

import {
  fetchCharacterById,
  getSelectedCharacter,
  updateCharacterRequest,
  updateCharacterPhotoRequest,
} from "../../../redux/reducers/charactersRedux";

/* =====================================================
   EDIT CHARACTER COMPONENT
   ===================================================== */

const EditCharacter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const selectedCharacter = useSelector(getSelectedCharacter);
  const character =
    selectedCharacter?._id === id ? selectedCharacter : null;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     FETCH CHARACTER
     ===================================================== */

  useEffect(() => {
    let isMounted = true;

    const loadCharacter = async () => {
      setIsLoading(true);
      setError("");
      setSuccess("");

      try {
        await dispatch(fetchCharacterById(id));
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
            "Failed to load character."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadCharacter();
    } else {
      setError("Character ID is missing.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  /* =====================================================
     UPDATE CHARACTER DATA
     ===================================================== */

  const handleUpdateCharacter = async data => {
    if (!id) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await dispatch(updateCharacterRequest(id, data));

      setSuccess("Character details have been saved.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update character."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =====================================================
     UPLOAD CHARACTER PHOTO
     ===================================================== */

  const handleUploadPhoto = async file => {
    if (!id) return;

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      await dispatch(updateCharacterPhotoRequest(id, file));

      setSuccess("Character photo has been updated.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to upload character photo."
      );

      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  /* =====================================================
     PAGE STATES
     ===================================================== */

  if (isLoading) {
    return (
      <div className={styles.root}>
        <Container>
          <p>Loading character...</p>
        </Container>
      </div>
    );
  }

  if (!character) {
    return (
      <div className={styles.root}>
        <Container>
          <h1>Edit character</h1>

          <p className="text-danger" role="alert">
            {error || "Character not found."}
          </p>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </Container>
      </div>
    );
  }

  /* =====================================================
     PAGE LAYOUT
     ===================================================== */

  return (
    <div className={styles.root}>
      <Container>
        <h1>Edit character</h1>

        {error && (
          <p className="text-danger" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="text-success" role="status">
            {success}
          </p>
        )}

        {/* CHARACTER TEXT DATA */}
        <section className={styles.formSection}>
          <h2>Character details</h2>

          <CharacterForm
            character={character}
            onSubmit={handleUpdateCharacter}
            submitText="Save changes"
            isSaving={isSaving}
            backTo={`/character/${character._id}`}
          />
        </section>

        {/* CHARACTER PHOTO */}
        <section className={styles.photoSection}>

          <ImageUpload
            title="Character Photo"
            label="Choose a new photo"
            currentImage={character.photo}
            currentImageAlt={`${character.firstName} photo`}
            onUpload={handleUploadPhoto}
            isUploading={isUploading}
            maxSizeMB={2}
            uploadButtonLabel="Upload photo"
            successMessage="Character photo updated successfully."
          />
          
        </section>
      </Container>
    </div>
  );
};

export default EditCharacter;
