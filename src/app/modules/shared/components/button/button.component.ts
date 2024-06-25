import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, FontAwesomeModule, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() typeBtn: 'reset' | 'submit' | 'button' = 'button';
  @Input() text: string = '';
  @Input() color: 'primary' | 'secondary' | 'logout' = 'secondary';
  @Input() fullWidth: boolean = false;

  faSpinner = faSpinner;
}
