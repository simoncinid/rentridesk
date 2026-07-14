export type VercelRequest = {
  method?: string;
  body?: unknown;
};

export type VercelResponse = {
  status: (statusCode: number) => {
    json: (body: unknown) => void;
  };
};
