import querystring from 'querystring';
import fetch from 'node-fetch';
import { CLIENT_ID, SPOTIFY_SCOPE } from './constants';
import { generateChallenge, generateRandomString, IChallenge } from './pkce';

const getUrlPath = (): string => {
  const {protocol, hostname, port} = window.location;
  return protocol + '//' + hostname + (port ? ':' : '') + port;
};

export interface IAuthentication extends IChallenge {
  readonly state: string;
  readonly authenticationUrl: string;
}

export async function authenticate(): Promise<IAuthentication> {
  const state = generateRandomString(16);
  const { code_challenge, code_verifier } = await generateChallenge();
  const authenticationUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SPOTIFY_SCOPE,
      redirect_uri: getUrlPath() + '/callback',
      state: state,
      code_challenge,
      code_challenge_method: 'S256',
    });

  return { state, authenticationUrl, code_challenge, code_verifier };
}

export async function callback(code: string, code_verifier: string): Promise<any> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
    body: querystring.stringify({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      redirect_uri: window.location.href.split('?')[0],
      code,
      code_verifier,
    }),
  });
  return await response.json();
}