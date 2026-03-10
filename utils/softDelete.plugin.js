module.exports = function softDeletePlugin(schema) {

  schema.add({
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date }
  });

  schema.pre(/^find/, function () {
    if (!this.getOptions().withDeleted) {
      this.where({ is_deleted: { $ne: true } });
    }
  });

  schema.methods.softDelete = function () {
    this.is_deleted = true;
    this.deleted_at = new Date();
    return this.save();
  };
};