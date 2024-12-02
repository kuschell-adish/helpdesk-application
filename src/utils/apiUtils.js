export const getUrl = (resource) => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    if (!baseUrl) {
      console.log("error fetching from env")
    }
    return `${baseUrl}/${resource}`;
  };