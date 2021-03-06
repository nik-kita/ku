import axios from 'axios';
import { HOST } from '../enums/endpoint.enum';
import { SignGenerator } from './sign-generator.api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseMethod<TRes, TParams extends object = any, TBody extends object = any> {
    protected constructor(
      private method: 'GET' | 'POST' | 'DELETE',
      protected endpoint: string,
      protected params?: TParams,
      protected body?: TBody,
    ) { }

    protected paramsResolver: (params: any) => any = (params: any) => params;

    protected bodyResolver: (body: any) => any = (body: any) => body;

    public async exec() {
        const headers = SignGenerator
            .create()
            .generateHeaders(
                {
                    method: this.method,
                    endpoint: this.endpoint,
                    params: this.params,
                    body: this.body,
                },
            );

        const { data: axiosData } = await axios({
            headers,
            method: this.method,
            url: HOST + this.endpoint,
            params: this.params,
            data: this.body,
        });
        const { data } = axiosData;

        return data as Promise<TRes | undefined>;
    }

    protected setBody(body: TBody) {
        this.body = this.bodyResolver(body);

        return this;
    }

    protected setParams(params: TParams) {
        this.params = this.paramsResolver(params);

        return this;
    }
}
