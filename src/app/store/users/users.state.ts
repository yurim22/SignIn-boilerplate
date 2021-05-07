import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { UserInfoService } from 'src/app/signin/services/user-info.service';
import { GetCurrentUser } from './users.actions';

export interface CurrentUser{
    user: Array<UserStateModel>;
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
        user: []
    }
})

@Injectable()
export class CurrentUserState {
    @Action(GetCurrentUser)
    getCurrentUser(ctx: StateContext<CurrentUser>): void {
        const state = ctx.getState();
        ctx.setState({
            user: []
        });
    }
}

