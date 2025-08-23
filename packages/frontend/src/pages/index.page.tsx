import { useLoaderData } from "@tanstack/react-router";

export const IndexPage = () => {
  const loaderData = useLoaderData({ from: "/" });

  return (
    <div>
      <h1>{loaderData.name}</h1>
    </div>
  );
};
