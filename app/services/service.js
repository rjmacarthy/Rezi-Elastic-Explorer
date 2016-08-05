import * as config from '../config';
import * as superagent from 'superagent';


export const request = (url, method, resource, query, data) => {
    return data ? superagent.post(`${url}/${resource}`).send(data) : superagent.get(`${url}/${resource}`).query(query);
}
