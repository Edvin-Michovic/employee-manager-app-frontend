import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee: Employee | any;
  public deleteEmployee: Employee | any;

  constructor(private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void{
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('close-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        window.alert('Employee updated successfully.');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    if(!key) {
      this.getEmployees();
    }
    const results: Employee[] = [];
    for(const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || (employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1)
      || (employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1)
      || (employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1)) {
        results.push(employee);
      } 
    }
    this.employees = results;
  }

  public onOpenModal(employee: Employee, mode: String): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addEmployeeModal');
    } 
    else if (mode === 'edit') {
      this.editEmployee = { ... employee };
      button.setAttribute('data-bs-target', '#updateEmployeeModal');
    } 
    else if (mode === 'delete') {
      this.deleteEmployee = { ... employee };
      button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public refreshForm(editForm: NgForm): void {
    editForm.setValue(this.editEmployee);
  }

}
