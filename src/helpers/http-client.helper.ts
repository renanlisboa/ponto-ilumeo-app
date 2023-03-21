import { AlertHelper } from './alert.helper';

export class HttpClientHelper {
  alertHelper: any;

  constructor() {
    this.alertHelper = new AlertHelper();
  }

  async get(url: string, query: any): Promise<any> {
    const queryParams = new URLSearchParams(query);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${url}?${queryParams}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    );
    if (response.status == 500) {
      this.alertHelper.error(
        'Erro ao buscar dados. Tente novamente mais tarde',
      );
      return null;
    }
    return await response.json();
  }

  async post(url: string, body: any): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (response.status == 400 || response.status == 500) {
      this.alertHelper.error(
        'Erro ao cadastrar. Verifique os dados e tente novamente',
      );
      return null;
    }
    return await response.json();
  }

  async put(url: string, id: string, body: any): Promise<any> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${url}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(body),
      },
    );
    if (
      response.status == 400 ||
      response.status == 404 ||
      response.status == 500
    ) {
      this.alertHelper.error(
        'Erro ao atualizar. Verifique os dados e tente novamente',
      );
      return null;
    }
    return await response.json();
  }
}
