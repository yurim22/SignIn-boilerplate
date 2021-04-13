import { Apollo, gql } from 'apollo-angular';

//users
export const USER_LIST = gql`
    query AllUsers {
        getAllUsers{
            id
            name
            permission
            institution
            creation_timestamp
            seq
        }
    }
`
export const DELETE_USER = gql`
    mutation DeleteUser($seq: Int!){
        deleteUser(seq: $seq){
            id
        }
    }
`

export const CREATE_USER = gql`
    mutation CreateUser($data: SignupInput!) {
        signup(data: $data){
            id,
            password
        }
    }
`

//auth
export const LOGIN_INFO = gql`
    query UserLogin($data: LoginInput!) {
        signIn(data: $data){
            accessToken,
            refreshToken
        }
    }
`
//signin
export const FIND_USER = gql`
    query FindOneUser($id: String!) {
        getOneUser(id: $id){
            seq
            id
            name
            password
            permission
            creation_timestamp
        }
    }
`