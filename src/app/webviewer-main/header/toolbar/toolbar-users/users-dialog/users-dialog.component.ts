import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
// import { Apollo, gql } from 'apollo-angular';
import { User } from 'src/app/models/user.model';
import { UserService } from '../users.service';
import { CreateNewUserDialogComponent } from './new-user-dialog.component';
// import { USER_LIST, DELETE_USER} from 'src/app/common/graphql/gql';

type PartialUser = Partial<User>
const USER_DATA: PartialUser[] = [
    {id: 'bombom', name: 'bom', permission: 'admin', institution: 'yurim', creation_timeStamp: '21-01-03'}
]

@Component({
    selector: 'app-users-dialog',
    templateUrl: './users-dialog.component.html',
    styleUrls: ['./users-dialog.component.css']
})

export class UsersDialogComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'permission','creation_timestamp','institution', 'edit'];
    displayedTitle = ['ID', 'Name', 'Permission', 'Creation Date', 'Institution']
    columnsFromDB: string[] = ['id', 'name', 'permission','creation_timestamp','institution'];

    dataSource = new MatTableDataSource<User>();
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private dialog: MatDialog,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.getUserList();
    }

    ngAfterViewInit(): void {
        console.log('[userlist table.ngAfterViewInit]');
    
        this.dataSource.paginator = this.paginator;
    }

    getUserList() {
        this.userService.getUserList().subscribe(
            (result) => {
                console.log('this is datasource', this.dataSource);
                this.dataSource.data = result;
                console.log(this.dataSource.data)
            },
            (error) => console.log(error)
        )
    }

    deleteUser(row) {
        this.userService.deleteUser(row.id).subscribe(
            (result)=> {
                console.log(result)
                console.log('delete success');
                this.getUserList()
            },
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

}
