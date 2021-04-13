import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo, gql } from 'apollo-angular';
import { User } from 'src/app/components/user.component';
import { CreateNewUserDialogComponent } from './new-user-dialog.component';
import { USER_LIST, DELETE_USER} from 'src/app/common/graphql/gql';

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

    constructor(
        private apollo: Apollo,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getUserList();
    }
    displayedColumns: string[] = ['id', 'name', 'permission','creation_timestamp','institution', 'edit'];
    displayedTitle = ['ID', 'Name', 'Permission', 'Creation Date', 'Institution']
    columnsFromDB: string[] = ['id', 'name', 'permission','creation_timestamp','institution'];
    dataSource = new MatTableDataSource<User>();

    // dataSource = new MatTableDataSource<User>();
    // dataSource = USER_DATA

    getUserList() {
        this.apollo.watchQuery<any>({
            query: USER_LIST
        }).valueChanges.subscribe(
            ({data}) => {
                console.log('this is datasource', this.dataSource)
                this.dataSource.data = data.getAllUsers
                console.log(this.dataSource.data)
            }
        )
    }

    openCreateNewUserDialog(){
        console.log('settings')
        this.dialog.closeAll();
        const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
            autoFocus: false,
            width: '18vw',
            height: '70vh'
        })

        dialogRef.afterClosed().subscribe(result => {
            console.log('the dialog was closed');
            this.dialog.open(UsersDialogComponent, {
                autoFocus: false,
                width: '40vw',
                height: '45vh'
            })
        })

        dialogRef.afterClosed().subscribe(result => {
            console.log('the dialogRef was closed');
        })

        // parDialogRef.afterClosed().subscribe(result => {
        //     console.log('the dialogRef was closed');
        // })

    }

    deleteUser(row: Partial<User>){
        console.log(row.seq)
        this.apollo.mutate({
            mutation: DELETE_USER,
            variables: {
                seq: row.seq
            }
        }).subscribe(
            ({data}) => {
                console.log(data)
                console.log('delete success')
            },
            (error) => console.log(error)
        )
    }
}
