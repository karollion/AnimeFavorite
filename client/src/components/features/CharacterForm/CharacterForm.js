
/* =====================================================
   CHARACTER FORM
   ===================================================== */

/**
 * @file CharacterForm.js
 * @description Reusable form for creating and editing character data.
 *              Photo uploads are handled separately in EditCharacter.
 */

import styles from "./CharacterForm.module.scss";
import { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

import Button from "../../common/Button/Button";

/* =====================================================
   CHARACTER FORM COMPONENT
   ===================================================== */

/**
 * @component
 * @description Renders character fields for creation or editing.
 *
 * @param {Object|null} props.character - Character being edited.
 * @param {string} props.animeId - Parent anime ID for a new character.
 * @param {Function} props.onSubmit - Receives the validated payload.
 * @param {string} props.submitText - Submit button label.
 * @param {boolean} props.isSaving - Indicates an active save request.
 * @param {string} props.backTo - URL for the back button.
 */
const CharacterForm = ({
  character = null,
  animeId = "",
  onSubmit,
  submitText = "Save",
  isSaving = false,
  backTo = "/",
}) => {
  /* =====================================================
     FORM INITIALIZATION
     ===================================================== */

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "unknown",
      role: "side",
      description: "",
      species: "",
      age: "",
      originWorld: "",
    },
  });

  /* =====================================================
     FORM DATA SYNCHRONIZATION
     ===================================================== */

  /**
   * Populates the form when an existing character is loaded.
   * Resets to empty values when creating a new character.
   */
  useEffect(() => {
    reset({
      firstName: character?.firstName || "",
      lastName: character?.lastName || "",
      gender: character?.gender || "unknown",
      role: character?.role || "side",
      description: character?.description || "",
      species: character?.species || "",
      age: character?.age ?? "",
      originWorld: character?.originWorld || "",
    });
  }, [character, reset]);

  /* =====================================================
     FORM SUBMISSION
     ===================================================== */

  /**
   * Adds the parent anime ID to the payload.
   * No photo is included in this request.
   */
  const handleFormSubmit = async data => {
    const assignedAnimeId =
      animeId ||
      (typeof character?.anime === "object"
        ? character.anime?._id
        : character?.anime);

    if (!assignedAnimeId) {
      console.error("CharacterForm requires an anime ID.");
      return;
    }

    const payload = {
      ...data,
      anime: assignedAnimeId,
      age: data.age === "" || data.age === undefined
        ? undefined
        : Number(data.age),
    };

    if (typeof onSubmit !== "function") {
      console.error("CharacterForm requires an onSubmit function.");
      return;
    }

    await onSubmit(payload);
  };

  /* =====================================================
     FORM RENDERING
     ===================================================== */

  return (
    <Form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={styles.root}
    >
      {/* FIRST NAME */}
      <Form.Group className="mb-3">
        <Form.Label>First name *</Form.Label>

        <Form.Control
          {...register("firstName", {
            required: "First name is required.",
            minLength: {
              value: 2,
              message: "First name must have at least 2 characters.",
            },
            maxLength: {
              value: 60,
              message: "First name cannot exceed 60 characters.",
            },
          })}
          isInvalid={!!errors.firstName}
          placeholder="Enter first name"
        />

        <Form.Control.Feedback type="invalid">
          {errors.firstName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* LAST NAME */}
      <Form.Group className="mb-3">
        <Form.Label>Last name</Form.Label>

        <Form.Control
          {...register("lastName", {
            maxLength: {
              value: 60,
              message: "Last name cannot exceed 60 characters.",
            },
          })}
          isInvalid={!!errors.lastName}
          placeholder="Enter last name"
        />

        <Form.Control.Feedback type="invalid">
          {errors.lastName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* GENDER */}
      <Form.Group className="mb-3">
        <Form.Label>Gender *</Form.Label>

        <Form.Select
          {...register("gender", {
            required: "Choose a gender value.",
          })}
          isInvalid={!!errors.gender}
        >
          <option value="unknown">Unknown</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {errors.gender?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* CHARACTER ROLE */}
      <Form.Group className="mb-3">
        <Form.Label>Character role *</Form.Label>

        <Form.Select
          {...register("role", {
            required: "Choose a character role.",
          })}
          isInvalid={!!errors.role}
        >
          <option value="main">Main</option>
          <option value="support">Support</option>
          <option value="side">Side</option>
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {errors.role?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* SPECIES */}
      <Form.Group className="mb-3">
        <Form.Label>Species *</Form.Label>

        <Form.Select
          {...register("species", {
            required: "Choose a character species.",
          })}
          isInvalid={!!errors.species}
        >
          <option value="">-- choose species --</option>

          {/* COMMON SPECIES */}
          <optgroup label="Common species">
            <option value="Human">Human</option>
            <option value="Demon">Demon</option>
            <option value="Angel">Angel</option>
            <option value="Elf">Elf</option>
            <option value="Dark Elf">Dark Elf</option>
            <option value="Dwarf">Dwarf</option>
            <option value="Beastkin">Beastkin</option>
            <option value="Animal">Animal</option>
            <option value="Monster">Monster</option>
            <option value="Dragon">Dragon</option>
            <option value="Dragonkin">Dragonkin</option>
            <option value="Vampire">Vampire</option>
            <option value="Werewolf">Werewolf</option>
            <option value="Spirit">Spirit</option>
            <option value="Ghost">Ghost</option>
            <option value="God">God / Deity</option>
            <option value="Goddess">Goddess</option>
            <option value="Demi-God">Demi-God</option>
            <option value="Fairy">Fairy</option>
            <option value="Witch">Witch</option>
            <option value="Wizard">Wizard / Mage</option>
            <option value="Undead">Undead</option>
            <option value="Skeleton">Skeleton</option>
            <option value="Zombie">Zombie</option>
            <option value="Slime">Slime</option>
            <option value="Golem">Golem</option>
            <option value="Doll">Doll / Puppet</option>
            <option value="Robot">Robot / Android</option>
            <option value="Alien">Alien</option>
            <option value="Cyborg">Cyborg</option>
            <option value="Artificial Human">Artificial Human</option>
            <option value="Mermaid">Mermaid</option>
            <option value="Merman">Merman</option>
            <option value="Nekomata">Nekomata</option>
            <option value="Kitsune">Kitsune</option>
            <option value="Oni">Oni</option>
            <option value="Tengu">Tengu</option>
            <option value="Kappa">Kappa</option>
            <option value="Yokai">Yōkai</option>
            <option value="Shinigami">Shinigami</option>
            <option value="Homunculus">Homunculus</option>
            <option value="Succubus">Succubus</option>
            <option value="Incubus">Incubus</option>
            <option value="Phoenix">Phoenix</option>
            <option value="Leviathan">Leviathan</option>
            <option value="Titan">Titan</option>
            <option value="Giant">Giant</option>
            <option value="Cyclops">Cyclops</option>
            <option value="Ogre">Ogre</option>
            <option value="Orc">Orc</option>
            <option value="Goblin">Goblin</option>
            <option value="Troll">Troll</option>
            <option value="Lizardman">Lizardman</option>
            <option value="Merfolk">Merfolk</option>
            <option value="Plant">Plant-based being</option>
            <option value="Living Armor">Living Armor</option>
            <option value="Eldritch Being">Eldritch Being</option>
          </optgroup>

          {/* HUMAN HYBRIDS */}
          <optgroup label="Human hybrids">
            <option value="Human/Demon">Human / Demon</option>
            <option value="Human/Angel">Human / Angel</option>
            <option value="Human/Elf">Human / Elf</option>
            <option value="Human/Dark Elf">Human / Dark Elf</option>
            <option value="Human/Dragon">Human / Dragon</option>
            <option value="Human/Dragonkin">Human / Dragonkin</option>
            <option value="Human/Beastkin">Human / Beastkin</option>
            <option value="Human/Vampire">Human / Vampire</option>
            <option value="Human/Werewolf">Human / Werewolf</option>
            <option value="Human/Spirit">Human / Spirit</option>
            <option value="Human/God">Human / God</option>
            <option value="Human/Fairy">Human / Fairy</option>
            <option value="Human/Monster">Human / Monster</option>
            <option value="Human/Alien">Human / Alien</option>
            <option value="Human/Youkai">Human / Yōkai</option>
            <option value="Human/Artificial">Human / Artificial being</option>
          </optgroup>

          {/* OTHER HYBRIDS */}
          <optgroup label="Other hybrids">
            <option value="Demon/Angel">Demon / Angel</option>
            <option value="Elf/Dragon">Elf / Dragon</option>
            <option value="Elf/Beastkin">Elf / Beastkin</option>
            <option value="Demon/Dragon">Demon / Dragon</option>
            <option value="Demon/Vampire">Demon / Vampire</option>
            <option value="Angel/God">Angel / God</option>
            <option value="Beastkin/Dragon">Beastkin / Dragon</option>
            <option value="Vampire/Werewolf">Vampire / Werewolf</option>
            <option value="Monster/Human">Monster / Human</option>
            <option value="Multiple Species">Multiple species</option>
          </optgroup>

          {/* SPECIAL CASES */}
          <optgroup label="Special cases">
            <option value="Reincarnated Being">Reincarnated being</option>
            <option value="Transformed Human">Transformed human</option>
            <option value="Possessed Human">Possessed human</option>
            <option value="Unknown">Unknown</option>
            <option value="Other">Other</option>
          </optgroup>
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {errors.species?.message}
        </Form.Control.Feedback>
      </Form.Group>


      {/* AGE */}
      <Form.Group className="mb-3">
        <Form.Label>Age</Form.Label>

        <Form.Control
          type="number"
          {...register("age", {
            setValueAs: value =>
              value === "" ? undefined : Number(value),
            min: {
              value: 0,
              message: "Age cannot be negative.",
            },
            max: {
              value: 10000,
              message: "Age cannot exceed 10000.",
            },
            validate: value =>
              value === undefined ||
              Number.isInteger(value) ||
              "Enter a whole number.",
          })}
          isInvalid={!!errors.age}
          placeholder="Enter age"
        />

        <Form.Control.Feedback type="invalid">
          {errors.age?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* ORIGIN WORLD */}
      <Form.Group className="mb-3">
        <Form.Label>Origin world</Form.Label>

        <Form.Control
          {...register("originWorld", {
            maxLength: {
              value: 100,
              message: "Origin world cannot exceed 100 characters.",
            },
          })}
          isInvalid={!!errors.originWorld}
          placeholder="Enter origin world or universe"
        />

        <Form.Control.Feedback type="invalid">
          {errors.originWorld?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* DESCRIPTION */}
      <Form.Group className="mb-3">
        <Form.Label>Description / biography</Form.Label>

        <Form.Control
          as="textarea"
          rows={5}
          {...register("description", {
            maxLength: {
              value: 5000,
              message: "Description cannot exceed 5000 characters.",
            },
          })}
          isInvalid={!!errors.description}
          placeholder="Enter character description"
        />

        <Form.Control.Feedback type="invalid">
          {errors.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* FORM ACTIONS */}
      <Row className="mt-4">
        <Col>
          <Button to={backTo}>Back</Button>
        </Col>

        <Col className="text-end">
          <Button type="submit" active={!isSaving}>
            {isSaving ? "Saving..." : submitText}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CharacterForm;
