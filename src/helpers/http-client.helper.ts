import { AlertHelper } from './alert.helper';

export class HttpClientHelper {
  alertHelper: any;

  constructor() {
    this.alertHelper = new AlertHelper();
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
    this.alertHelper.success('Bem vindo');
    return await response.json();
  }
}
