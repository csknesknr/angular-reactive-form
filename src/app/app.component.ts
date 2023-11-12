import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Employee } from './employee.model';
import { NotificationService } from './notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  addForm: FormGroup = new FormGroup({});
  updateForm: FormGroup = new FormGroup({});
  employees: Employee[] = [];
  isUpdateFormActive: boolean = false;
  updateIndexNumber: number = 0;
  constructor(
    private _date: DatePipe,
    private _formBuilder: FormBuilder,
    private _notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.createAddForm();
  }

  createAddForm = () => {
    this.addForm = this._formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      startingDate: new FormControl(
        this._date.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required
      ),
      title: new FormControl('', Validators.required),
    });
  };

  save = () => {
    if (this.addForm.valid) {
      this.employees.push(this.addForm.value);
      this.createAddForm();
      this._notify.showSuccess('İşlem Başarılı', 'Başarılı');
    } else {
    }
  };

  createUpdateForm = () => {
    this.updateForm = this._formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      startingDate: new FormControl(
        this._date.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required
      ),
      title: new FormControl('', Validators.required),
    });
  };

  update = () => {
    if (this.updateForm.valid) {
      this.employees[this.updateIndexNumber] = this.updateForm.value;
      this._notify.showSuccess('İşlem Başarılı', 'Başarılı');
      this.cancel();
    } else {
    }
  };

  get(model: Employee, index: number) {
    this.createUpdateForm();
    this.updateForm.controls['firstName'].setValue(model.firstName);
    this.updateForm.controls['lastName'].setValue(model.lastName);
    this.updateForm.controls['startingDate'].setValue(model.startingDate);
    this.updateForm.controls['title'].setValue(model.title);
    this.isUpdateFormActive = true;
    this.updateIndexNumber = index;
  }
  cancel = () => {
    this.isUpdateFormActive = false;
  };

  delete = (index: number) => {
    Swal.fire({
      title: 'Kayıt silinecektir.?',
      text: 'Silmek İstediğinize emin misin!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet!',
      cancelButtonText: 'Hayır',
    }).then((result) => {
      if (result.value) {
        this.employees.splice(index, 1);
        this._notify.showSuccess('Kayıt Başarıyla Silindi', 'Başarılı');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Vazgeçildi', 'Silme işleminden vazgeçtiniz)', 'error');
      }
    });
  };
}
