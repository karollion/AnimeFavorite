
/* =====================================================
   CHARACTER FORM
   ===================================================== */

/**
 * @file CharacterForm.js
 * @description Reusable form for creating and editing character data.
 *              Photo uploads are handled separately in EditCharacter.
 */

import styles from './CharacterForm.module.scss'

import { useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import Button from '../../common/Button/Button'

/* =====================================================
   SPECIES OPTIONS
   ===================================================== */

/**
 * Defines the available species grouped by category.
 * Translation keys are used for labels, while values remain unchanged
 * to preserve compatibility with the API.
 */
const speciesGroups = [
  {
    key: 'common',
    options: [
      'Human', 'Demon', 'Angel', 'Elf', 'Dark Elf', 'Dwarf',
      'Beastkin', 'Animal', 'Monster', 'Dragon', 'Dragonkin',
      'Vampire', 'Werewolf', 'Spirit', 'Ghost', 'God', 'Goddess',
      'Demi-God', 'Fairy', 'Witch', 'Wizard', 'Undead', 'Skeleton',
      'Zombie', 'Slime', 'Golem', 'Doll', 'Robot', 'Alien', 'Cyborg',
      'Artificial Human', 'Mermaid', 'Merman', 'Nekomata', 'Kitsune',
      'Oni', 'Tengu', 'Kappa', 'Yokai', 'Shinigami', 'Homunculus',
      'Succubus', 'Incubus', 'Phoenix', 'Leviathan', 'Titan', 'Giant',
      'Cyclops', 'Ogre', 'Orc', 'Goblin', 'Troll', 'Lizardman',
      'Merfolk', 'Plant', 'Living Armor', 'Eldritch Being',
    ],
  },
  {
    key: 'humanHybrids',
    options: [
      'Human/Demon', 'Human/Angel', 'Human/Elf', 'Human/Dark Elf',
      'Human/Dragon', 'Human/Dragonkin', 'Human/Beastkin',
      'Human/Vampire', 'Human/Werewolf', 'Human/Spirit', 'Human/God',
      'Human/Fairy', 'Human/Monster', 'Human/Alien', 'Human/Youkai',
      'Human/Artificial',
    ],
  },
  {
    key: 'otherHybrids',
    options: [
      'Demon/Angel', 'Elf/Dragon', 'Elf/Beastkin', 'Demon/Dragon',
      'Demon/Vampire', 'Angel/God', 'Beastkin/Dragon',
      'Vampire/Werewolf', 'Monster/Human', 'Multiple Species',
    ],
  },
  {
    key: 'specialCases',
    options: [
      'Reincarnated Being', 'Transformed Human', 'Possessed Human',
      'Unknown', 'Other',
    ],
  },
]

/**
 * Converts a species value into its corresponding translation key.
 *
 * @param {string} value - Original species value.
 * @returns {string} Translation key suffix.
 */
const getSpeciesTranslationKey = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')

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
 * @param {string} props.submitText - Optional submit button label.
 * @param {boolean} props.isSaving - Indicates an active save request.
 * @param {string} props.backTo - URL for the back button.
 */
const CharacterForm = ({
  character = null,
  animeId = '',
  onSubmit,
  submitText,
  isSaving = false,
  backTo = '/',
}) => {
  const { t } = useTranslation()

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
      firstName: '',
      lastName: '',
      gender: 'unknown',
      role: 'side',
      species: '',
      description: '',
      age: '',
      originWorld: '',
    },
  })

  /* =====================================================
     FORM DATA SYNCHRONIZATION
     ===================================================== */

  /**
   * Populates the form when an existing character is loaded.
   * Resets to empty values when creating a new character.
   */
  useEffect(() => {
    reset({
      firstName: character?.firstName || '',
      lastName: character?.lastName || '',
      gender: character?.gender || 'unknown',
      role: character?.role || 'side',
      species: character?.species || '',
      description: character?.description || '',
      age: character?.age ?? '',
      originWorld: character?.originWorld || '',
    })
  }, [character, reset])

  /* =====================================================
     FORM SUBMISSION
     ===================================================== */

  /**
   * Adds the parent anime ID to the payload.
   * No photo is included in this request.
   *
   * @param {Object} data - Validated form data.
   */
  const handleFormSubmit = async (data) => {
    const assignedAnimeId =
      animeId ||
      (typeof character?.anime === 'object'
        ? character.anime?._id
        : character?.anime)

    if (!assignedAnimeId) {
      console.error('CharacterForm requires an anime ID.')
      return
    }

    if (typeof onSubmit !== 'function') {
      console.error('CharacterForm requires an onSubmit function.')
      return
    }

    const payload = {
      ...data,
      anime: assignedAnimeId,
      age:
        data.age === '' || data.age === undefined
          ? undefined
          : Number(data.age),
    }

    await onSubmit(payload)
  }

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
        <Form.Label>{t('characterForm.firstName')} *</Form.Label>

        <Form.Control
          {...register('firstName', {
            required: t('characterForm.validation.firstNameRequired'),
            minLength: {
              value: 2,
              message: t('characterForm.validation.firstNameMinLength'),
            },
            maxLength: {
              value: 60,
              message: t('characterForm.validation.firstNameMaxLength'),
            },
          })}
          isInvalid={!!errors.firstName}
          placeholder={t('characterForm.placeholders.firstName')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.firstName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* LAST NAME */}
      <Form.Group className="mb-3">
        <Form.Label>{t('characterForm.lastName')}</Form.Label>

        <Form.Control
          {...register('lastName', {
            maxLength: {
              value: 60,
              message: t('characterForm.validation.lastNameMaxLength'),
            },
          })}
          isInvalid={!!errors.lastName}
          placeholder={t('characterForm.placeholders.lastName')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.lastName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* GENDER */}
      <Form.Group className="mb-3">
        <Form.Label>{t('characterForm.gender')} *</Form.Label>

        <Form.Select
          {...register('gender', {
            required: t('characterForm.validation.genderRequired'),
          })}
          isInvalid={!!errors.gender}
        >
          <option value="unknown">
            {t('characterForm.genderOptions.unknown')}
          </option>
          <option value="male">
            {t('characterForm.genderOptions.male')}
          </option>
          <option value="female">
            {t('characterForm.genderOptions.female')}
          </option>
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {errors.gender?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* CHARACTER ROLE */}
      <Form.Group className="mb-3">
        <Form.Label>{t('characterForm.role')} *</Form.Label>

        <Form.Select
          {...register('role', {
            required: t('characterForm.validation.roleRequired'),
          })}
          isInvalid={!!errors.role}
        >
          <option value="main">
            {t('characterForm.roleOptions.main')}
          </option>
          <option value="support">
            {t('characterForm.roleOptions.support')}
          </option>
          <option value="side">
            {t('characterForm.roleOptions.side')}
          </option>
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {errors.role?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* SPECIES */}
      <Form.Group className="mb-3">
        <Form.Label>{t('characterForm.species')} *</Form.Label>

        <Form.Select
          {...register('species', {
            required: t('characterForm.validation.speciesRequired'),
          })}
          isInvalid={!!errors.species}
        >
          <option value="">
            {t('characterForm.speciesPlaceholder')}
          </option>

          {speciesGroups.map((group) => (
            <optgroup
              key={group.key}
              label={t(`characterForm.speciesGroups.${group.key}`)}
            >
              {group.options.map((species) => (
                <option key={species} value={species}>
                  {t(
                    `characterForm.speciesOptions.${getSpeciesTranslationKey(species)}`
                  )}
                </option>
              ))}
            </optgroup>
          ))}
        </Form.Select>

        <Form.Control.Feedback type="invalid">
          {errors.species?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* AGE */}
      <Form.Group className="mb-3">
        <Form.Label>{t('characterForm.age')}</Form.Label>

        <Form.Control
          type="number"
          {...register('age', {
            setValueAs: (value) =>
              value === '' ? undefined : Number(value),
            min: {
              value: 0,
              message: t('characterForm.validation.ageMin'),
            },
            max: {
              value: 10000,
              message: t('characterForm.validation.ageMax'),
            },
            validate: (value) =>
              value === undefined ||
              Number.isInteger(value) ||
              t('characterForm.validation.ageInteger'),
          })}
          isInvalid={!!errors.age}
          placeholder={t('characterForm.placeholders.age')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.age?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* ORIGIN WORLD */}
      <Form.Group className="mb-3">
        <Form.Label>{t('characterForm.originWorld')}</Form.Label>

        <Form.Control
          {...register('originWorld', {
            maxLength: {
              value: 100,
              message: t('characterForm.validation.originWorldMaxLength'),
            },
          })}
          isInvalid={!!errors.originWorld}
          placeholder={t('characterForm.placeholders.originWorld')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.originWorld?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* DESCRIPTION */}
      <Form.Group className="mb-3">
        <Form.Label>{t('characterForm.description')}</Form.Label>

        <Form.Control
          as="textarea"
          rows={5}
          {...register('description', {
            maxLength: {
              value: 5000,
              message: t('characterForm.validation.descriptionMaxLength'),
            },
          })}
          isInvalid={!!errors.description}
          placeholder={t('characterForm.placeholders.description')}
        />

        <Form.Control.Feedback type="invalid">
          {errors.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* FORM ACTIONS */}
      <Row className="mt-4">
        <Col>
          <Button to={backTo}>
            {t('characterForm.back')}
          </Button>
        </Col>

        <Col className="text-end">
          <Button type="submit" active={!isSaving}>
            {isSaving
              ? t('characterForm.saving')
              : submitText || t('common.save')}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

/* =====================================================
   PROP TYPES
   ===================================================== */

CharacterForm.propTypes = {
  character: PropTypes.object,
  animeId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  isSaving: PropTypes.bool,
  backTo: PropTypes.string,
}

export default CharacterForm
