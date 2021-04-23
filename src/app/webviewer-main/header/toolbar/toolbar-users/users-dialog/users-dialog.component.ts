import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { from, zip } from 'rxjs';
import { map, mapTo, tap, toArray } from 'rxjs/operators';
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

export class UsersDialogComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'permission','creation_timestamp','institution', 'edit', 'invalid_password_count'];
    displayedTitle = ['ID', 'Name', 'Permission', 'Creation Date', 'Institution', 'Lockout Status']
    columnsFromDB: string[] = ['id', 'name', 'permission','creation_timestamp','institution'];

    dataSource = new MatTableDataSource<User>();

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        
    ) { }

    ngOnInit(): void {
        this.getUserList();
    }

    ngAfterViewInit(): void {
        console.log('[userlist table.ngAfterViewInit]');

        this.dataSource.paginator = this.paginator;
    }

    getUserList() {
        this.userService.getUserList()
        .subscribe(
            (result) => {
                console.log(result)
                from(result).pipe(
                    map(val=> val.creation_timestamp = val.creation_timestamp.slice(0,10)),
                ).subscribe()
                this.dataSource.data = result;
                console.log('this.dataSource.data',this.dataSource.data)
            },
            (error) => console.log(error)
        )
    }

    deleteUser(row) {
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
            (_res) => this.getUserList(),
            (error) => console.log(error)
        )
    }

    openCreateNewUserDialog(){
        console.log('settings')
        this.dialog.closeAll();
        const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
            autoFocus: false,
            width: '18vw',
            height: '70vh',
            data: {userInfo: undefined, mode: 'createMode'},
            hasBackdrop: false,
        })

        dialogRef.afterClosed().subscribe(_ => {
            console.log('the create dialog was closed');
            this.dialog.open(UsersDialogComponent, {
                autoFocus: false,
                width: '50vw',
                height: '55vh'
            })
        })

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('the dialogRef was closed');
        // })


    }

    openEditUserDialog(row: Partial<User>) {
        console.log(row)
        console.log('edit');
        this.dialog.closeAll();
        const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
            autoFocus: false,
            width: '18vw',
            height:'70vh',
            data: {userInfo: row, mode: 'editMode'},
            hasBackdrop: false,
        })

        dialogRef.afterClosed().subscribe(result => {
            console.log('the edit dialog was closed');
            this.dialog.open(UsersDialogComponent, {
                autoFocus: false,
                width: '50vw',
                height: '55vh'
            })
        })
    }

    unlockSelectedUsers(row: Partial<User>) {
        console.log(row);
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
            (_res) => this.getUserList(),
            (error) => console.log(error)
        )
    }

}

//yyyy-MM-dd formating
export function getFormatDate(date){
    var year = date.getFullYear();
    var month = (1 + date.getMonth());
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    return `${year}-${month}-${day}`;
}
