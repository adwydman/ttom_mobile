import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { buildUrl } from "..";

interface IRequestParams {
  queryKey?: string[],
  url: string,
  method?: 'GET' | 'POST',
  body?: any,
  isAuthenticated?: boolean,
  refetchOnScreenFocus?: boolean,
  onSuccess?: (data: any) => void
}

const useRequest = (
  {
    queryKey,
    url,
    method = 'GET',
    body,
    isAuthenticated = true,
    refetchOnScreenFocus = false,
    onSuccess = (data: any) => {},
    
  }: IRequestParams
) => {
  const userToken = useSelector((state: any) => state.storeSlice.userToken);

  const options: any = {
    method,
    headers: {},
  }

  if (isAuthenticated) {
    options.headers['Authorization'] = `Bearer ${userToken}`;
  }

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  if (method === 'GET') {
    return useQuery({
      queryKey,
      queryFn: async () => {
        const res = await fetch(buildUrl(url), options);
        return await res.json();
      },
      refetchOnWindowFocus: refetchOnScreenFocus,
      enabled: Boolean(userToken),
      onSuccess: onSuccess
    })
  } else if (method === 'POST') {
    const fetchFn = async () => {
      const response = await fetch(buildUrl(url), options);
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }
    
      return result;
    }

    return useMutation(fetchFn);
  }
}

const usePostRequest = ({ url, body }) => {
  const userToken = useSelector((state: any) => state.storeSlice.userToken);

  const fetchFn = () => {
    return fetch(buildUrl(url), {
      method: 'POST',
    })
  }

  return useMutation()
}

export default useRequest;
