import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { $, cd } from 'npm:zx@8.1.2';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  const { currentPath } = opts;

  cd(`${currentPath}/app/state`);

  const HASURA_GRAPHQL_ENDPOINT = Deno.env.get('HASURA_GRAPHQL_ENDPOINT');

  console.log(HASURA_GRAPHQL_ENDPOINT);
  await $`hasura metadata apply --endpoint ${HASURA_GRAPHQL_ENDPOINT}`;
}
