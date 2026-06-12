export const apiFetch = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(import.meta.env.VITE_BACKEND_URL + endpoint, {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    body: isFormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
