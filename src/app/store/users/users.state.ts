import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { UserInfoService } from "src/app/user-info.service";
import { GetCurrentUser } from './users.actions';

export interface CurrentUser{
    user: Array<UserStateModel>
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
    //constructor(private userInfoService: UserInfoService) {}

    @Action(GetCurrentUser)
    getCurrentUser(ctx: StateContext<CurrentUser>) {
        const state = ctx.getState();
        ctx.setState({
            user: []
        })
    }
}

