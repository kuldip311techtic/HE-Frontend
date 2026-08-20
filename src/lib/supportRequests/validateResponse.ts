export interface ResponseFieldErrors {
  response?: string;
}

export function validateResponsePayload(
  response: string,
): ResponseFieldErrors {
  const trimmed = response.trim();

  if (!trimmed) {
    return { response: 'Response is required.' };
  }

  return {};
}
