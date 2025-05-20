import type { CustomArgs, CustomOptions } from 'jsr:@ghostmind/run';
import { fetch } from 'npm:zx@8.1.2';

export default async function (_arg: CustomArgs, opts: CustomOptions) {
  const { url, port, has } = opts;
  const { tunnel, local } = url;

  if (has('tunnel')) {
    try {
      await fetch(tunnel);
      console.log('Tunnel is up and running');
    } catch (error) {
      console.error('Tunnel is down');
    }
  }

  if (has('local')) {
    try {
      await fetch(`${local}:${port}`);
      console.log('Local server is up and running');
    } catch (error) {
      console.error('Local server is down');
    }
  }
}
