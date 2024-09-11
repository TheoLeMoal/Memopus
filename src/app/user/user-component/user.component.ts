import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user-service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  userForm!: FormGroup<any>;
  loginError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.userForm.valid) {
      const { username, password } = this.userForm.value;
      this.userService.login(username, password).subscribe(success => {
        if (success) {
          this.router.navigate(['/tags']);
        } else {
          this.loginError = 'Nom d\'utilisateur ou mot de passe incorrect';
        }
      });
    }
  }
}
