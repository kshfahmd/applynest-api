const formatZodError = (zodError) => {
  const issues = zodError?.issues || [];

  return issues.map((issue) => ({
    field: issue.path?.join(".") || "unknown",
    message: issue.message,
  }));
};

module.exports = { formatZodError };
