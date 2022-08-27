import axios from 'axios';
import { Either, left, right } from 'fp-ts/lib/Either';

export const makeRequestFromURL = async <T>(
  url: string,
  parameters: Record<string, string | boolean | number> = {},
): Promise<Either<Error, T>> => {
  try {
    const response = await axios.get<T>(url, {
      params: parameters,
      responseType: 'json',
    });

    return right(response.data);
  } catch {
    return left(new Error('Something gone wrong with the request'));
  }
};
