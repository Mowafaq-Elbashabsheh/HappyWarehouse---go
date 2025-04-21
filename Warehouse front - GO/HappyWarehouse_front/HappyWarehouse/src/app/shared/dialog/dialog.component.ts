import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Globals } from '../../common/globals';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AlertService } from '../../common/alert';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatSelect, MatOption, MatCheckboxModule ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent implements OnInit {

  title: string = '';
  mode: string = '';
  formData: any;
  data: any;
  countries: any = Globals.countries;
  roles: any = Globals.roles;
  exceptKeys: any = ['id', 'country', 'role', 'active', 'msrpPrice', 'skuName'];

  @ViewChildren('dynamicInput') inputs!: QueryList<NgModel>;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private ref: MatDialogRef<DialogComponent>, private alertService: AlertService) {
    this.data = data;
  }

  ngOnInit(): void {
    this.title = this.data.title;
    this.mode = this.data.mode;
    delete this.data.title;
    delete this.data.mode;
    this.formData = {...this.data};
  }

  getKeys(obj: any): string[]{
    var exceptKeys = ['id', 'countryId', 'roleId']
    return Object.keys(obj).filter(x=> !exceptKeys.includes(x));
  }

  closeDialog() {
    this.ref.close();
  }

  AddEdit(mode = ''){
    
    if(!this.validateInputs(mode)){
      return;
    }
    this.ref.close(this.formData);
  }

  validateInputs(mode: any) {
    var keys = Object.keys(this.formData).filter(x=> !this.exceptKeys.includes(x))
    var isValid = true;
    keys.forEach(x=>{
      if(!this.formData[x]){
        isValid = false
      }
    });
    
    if(mode == 'changePassword'){
      if(this.formData['password'] != this.formData['confirmPassword']){
        this.alertService.showAlert('passwords are not equivalent');
        isValid = false;
      }
    }

    return isValid;
  }
}
