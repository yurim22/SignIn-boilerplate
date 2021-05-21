import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UserInfoService } from 'src/app/signin/services/user-info.service';
import { GetCurrentUser, UpdateUserLoginStatus } from './users.actions';

export interface CurrentUser{
    user: Array<UserStateModel>;
    loginStatus: string;
}

export interface UserStateModel {
    id: string;
    name: string;
    permission: string;
    institution: string;
    seq: number;
}

@State<CurrentUser>({
    name: 'currentUser',
    defaults: {
        user: [],
        loginStatus: undefined,
    }
})

@Injectable()
export class CurrentUserState {
    @Selector()
    static getUserLoginStatus(state: CurrentUser): string {
        return state.loginStatus;
    }
    @Action(GetCurrentUser)
    getCurrentUser(ctx: StateContext<CurrentUser>): void {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            user: []
        });
    }
    @Action(UpdateUserLoginStatus)
    updateUserLoginStatus(ctx: StateContext<CurrentUser>, {status}: UpdateUserLoginStatus): void {
        const state = ctx.getState();
        console.log(state);
        console.log(status);
        ctx.setState({
            ...state,
            loginStatus: status
        });
        console.log(ctx.getState());
    }
}
