/* =====================================================
   SOFT DELETE PLUGIN (MONGOOSE)
   ===================================================== */

/**
 * Adds soft delete functionality to a schema.
 *
 * Features:
 * - automatic filtering of deleted documents
 * - softDelete() instance method
 * - restore() instance method
 * - withDeleted query option
 * - onlyDeleted query option
 *
 * Usage:
 * schema.plugin(softDeletePlugin);
 */

module.exports = function softDeletePlugin(schema) {

  /* =====================================================
     FIELDS
     ===================================================== */

  schema.add({
    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  });

  /* =====================================================
     QUERY AUTO FILTER
     ===================================================== */

  /**
   * Automatically exclude soft-deleted documents
   * from all find queries unless explicitly enabled.
   *
   * Works for:
   * find
   * findOne
   * findById
   * findOneAndUpdate
   * etc.
   */
  schema.pre(/^find/, function () {
    const options = this.getOptions();

    // show ONLY deleted
    if (options.onlyDeleted) {
      this.where({ is_deleted: true });
      return;
    }

    // include deleted + active
    if (options.withDeleted) {
      return;
    }

    // default → hide deleted
    this.where({ is_deleted: { $ne: true } });
  });

  /* =====================================================
     INSTANCE METHODS
     ===================================================== */

  /**
   * Soft delete document.
   *
   * @returns {Promise<Document>}
   */
  schema.methods.softDelete = function () {
    this.is_deleted = true;
    this.deleted_at = new Date();
    return this.save();
  };

  /**
   * Restore soft deleted document.
   *
   * @returns {Promise<Document>}
   */
  schema.methods.restore = function () {
    this.is_deleted = false;
    this.deleted_at = null;
    return this.save();
  };

  /* =====================================================
     STATIC METHODS
     ===================================================== */

  /**
   * Find including deleted documents.
   */
  schema.statics.withDeleted = function () {
    return this.find().setOptions({ withDeleted: true });
  };

  /**
   * Find only deleted documents.
   */
  schema.statics.findDeleted = function () {
    return this.find().setOptions({ onlyDeleted: true });
  };
};