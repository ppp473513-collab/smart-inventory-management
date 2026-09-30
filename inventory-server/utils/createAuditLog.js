const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  action,
  description,
  user = null,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      action,
      description,
      user,
      metadata,
    });
  } catch (error) {
    // Audit logging should never
    // break the main operation.
    console.error(
      "AUDIT LOG ERROR:",
      error.message
    );
  }
};

module.exports = createAuditLog;