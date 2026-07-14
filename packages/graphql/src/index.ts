export type GraphqlOperationResult<T> = { data?: T; errors?: readonly { message: string }[] };
