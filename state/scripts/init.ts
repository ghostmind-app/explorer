import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { $, cd } from 'npm:zx@8.1.2';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  const { main, currentPath } = opts;

  const { dockerRegister, terraformActivate } = main;

  await dockerRegister({
    amd64: true,
  });

  await terraformActivate({
    component: 'core',
    arch: 'amd64',
    docker: 'default',
  });

  cd(`${currentPath}/app/state`);

  const HASURA_GRAPHQL_ENDPOINT = Deno.env.get('HASURA_GRAPHQL_ENDPOINT');

  await $`hasura migrate apply --endpoint ${HASURA_GRAPHQL_ENDPOINT} --database-name default`;

  await $`hasura metadata apply --endpoint ${HASURA_GRAPHQL_ENDPOINT}`;
}
