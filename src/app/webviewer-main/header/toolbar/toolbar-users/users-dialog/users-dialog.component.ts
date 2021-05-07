import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { from, Subject, zip } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, switchMap, takeUntil, tap, toArray } from 'rxjs/operators';
import { CommonDialogComponent } from 'src/app/common/dialog/common-dialog.component';
// import { Apollo, gql } from 'apollo-angular';
import { User } from 'src/app/signin/models/user.model';
import { UserService } from '../users.service';
import { CreateNewUserDialogComponent } from './new-user-dialog.component';
// import { USER_LIST, DELETE_USER} from 'src/app/common/graphql/gql';


@Component({
    selector: 'app-users-dialog',
    templateUrl: './users-dialog.component.html',
    styleUrls: ['./users-dialog.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})

export class UsersDialogComponent implements OnInit, AfterViewInit, OnDestroy {

    displayedColumns: string[] = ['id', 'name', 'permission', 'creation_timestamp', 'institution', 'edit', 'invalid_password_count'];
    displayedTitle = ['ID', 'Name', 'Permission', 'Creation Date', 'Institution', 'Lockout Status'];
    columnsFromDB: string[] = ['id', 'name', 'permission', 'creation_timestamp', 'institution'];

    userList: User[];
    dataSource = new MatTableDataSource<User>();
    unsubscribe$ = new Subject();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getUserList();
    }

    ngAfterViewInit(): void {
        console.log('[userlist table.ngAfterViewInit]');
        this.dataSource.paginator = this.paginator;
    }

    getUserList(): void {
        this.userService.getUserList().pipe(
            takeUntil(this.unsubscribe$)
        )
        .subscribe(
            (result) => {
                this.userList = result;
                from(result).pipe(
                    map(val => val.creation_timestamp = val.creation_timestamp.slice(0, 10)),
                ).subscribe();
                this.dataSource.data = result;
            },
            (error) => {
                console.log(error);
                if (error.error.message === 'Unauthorized'){
                    this.router.navigate(['/signin']);
                    localStorage.clear();
                }
            }
        );
    }

    deleteUser(row): void {
        // tslint:disable-next-line: new-parens
        const dialogConfig = new MatDialogConfig;
        dialogConfig.hasBackdrop = true;
        dialogConfig.autoFocus = false;
        dialogConfig.panelClass = 'common-dialog';
        dialogConfig.data = {
            name: 'Delete',
            title: 'Delete',
            description: 'Do you really want to delete user?',
            isConfirm: true,
            actionButtonText: 'OK',
            deleteUserId: row.id
        };

        const dialogRef = this.dialog.open(CommonDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            () => this.getUserList(),
            (error) => console.log(error)
        );
    }

    openCreateNewUserDialog(): void{
        console.log('settings');
        this.dialog.closeAll();
        const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
            autoFocus: false,
            width: '18vw',
            height: '70vh',
            data: {userInfo: undefined, mode: 'createMode'},
            hasBackdrop: false,
        });

        dialogRef.afterClosed().subscribe(_ => {
            console.log('the create dialog was closed');
            this.dialog.open(UsersDialogComponent, {
                autoFocus: false,
                width: '50vw',
                height: '55vh'
            });
        });
    }

    openEditUserDialog(row: Partial<User>): void {
        console.log(row);
        console.log('edit');
        this.dialog.closeAll();
        const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
            autoFocus: false,
            width: '18vw',
            height: '70vh',
            data: {userInfo: row, mode: 'editMode'},
            hasBackdrop: false,
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('the edit dialog was closed');
            this.dialog.open(UsersDialogComponent, {
                autoFocus: false,
                width: '50vw',
                height: '55vh'
            });
        });
    }

    unlockSelectedUsers(row: Partial<User>): void {
        console.log(row);
        // tslint:disable-next-line: new-parens
        const dialogConfig = new MatDialogConfig;
        dialogConfig.hasBackdrop = true;
        dialogConfig.autoFocus = false;
        dialogConfig.panelClass = 'common-dialog';
        dialogConfig.data = {
            name: 'Unlock',
            title: 'Unlock User',
            description: 'Do you really want to unlock this user?',
            isConfirm: true,
            actionButtonText: 'OK',
            unlockUserId: row.id
        };

        const dialogRef = this.dialog.open(CommonDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            () => this.getUserList(),
            (error) => console.log(error)
        );
    }
    onSearch(ev): void {
        const inputString = ev.target.value;
        this.dataSource.data = [];
        from(this.userList).pipe(
            takeUntil(this.unsubscribe$),
            switchMap( (user: User) => {
                const keys = Object.keys(user);
                // console.log('keys', keys)
                const keys2 = keys.filter( key => user[key] !== null); // remove key that has not value.
                return from(keys2).pipe(
                    takeUntil(this.unsubscribe$),
                    filter( key => key === 'id' || key === 'name' || key === 'permission' || key === 'institution'),
                    filter( key => user[key].indexOf(inputString) > -1),
                    map( _ => user),
                    distinctUntilChanged()
                );
            }),
            toArray()
        ).subscribe( val => {
            this.dataSource.data = val;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
