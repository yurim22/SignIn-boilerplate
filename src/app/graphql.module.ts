import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { setContext } from '@apollo/client/link/context';
import { LoginUserInfo } from './signin/auth.service';

const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
    const basic = setContext((operation, context) => ({
        headers: {
            Accept: 'charset=utf-8'
        }
    }))

    // const auth = setContext(async(_, { headers }) => {
    //     // 만료되지않은 토큰이 있다면, 변수에 저장
    //     let token = this.auth.getCachedAccessToken();

    //     if(!token) {
    //         await this.auth.acquireToken().toPromise();

    //         token = this.auth.getCachedAccessToken();
    //     }

    //     console.log(token);
    //     return {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     }
    // })
    const auth = setContext((operation, context) => {
        // 만료되지않은 토큰이 있다면, 변수에 저장
        const token = localStorage.getItem('token');
        console.log(token);
        if(token === null) {
            return {};
        } else{
            //header에 토큰을 담아서 요청을 보낸다.
            return {
                headers: {
                    Authorization: `JWT ${token}`
                }
            }
        }
    });

    const link = ApolloLink.from([basic, auth, httpLink.create({uri})]);
    const cache = new InMemoryCache({
        typePolicies: {
            Query: {
                fields:{
                    getOneUser: {
                        read(){
                            return LoginUserInfo();
                        }
                    }
                }
            }
        }
    });
    return {
        link,
        cache
    }
}

@NgModule({
    imports: [HttpClientModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule {}
