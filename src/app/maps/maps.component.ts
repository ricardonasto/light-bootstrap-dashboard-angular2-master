import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
})


export class MapsComponent { 
	constructor(public dialog: MatDialog) {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
	selector: 'dialog-animations-example-dialog',
	templateUrl: './dialog-overview-example-dialog.html',
  })
  export class DialogAnimationsExampleDialog {
	constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
  }
 