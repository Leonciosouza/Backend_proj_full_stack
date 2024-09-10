import { Component } from '@angular/core';
import { error, log } from 'console';
import { response } from 'express';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastroprod',
  standalone: true,
  imports: [FormBuilder, FormGroup, HttpClient],
  templateUrl: './cadastroprod.component.html',
  styleUrl: './cadastroprod.component.css'
})

export class CadastroprodComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: any = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Inicalizando o formulário com campos de validadores.
    this.productForm = this.fb.group({
      name:['', Validators.required],
      description: ['', [Validators.required.min(0)]],
      image: [null, Validators.required]
    });

  }

  // Método para manipular a seleção de arquivos (imagem).
  onFileSelected(event: any): void {
    if (event.target.files.length > 0 ) {
      this.selectedFile = event.target.files[0];

      // Visualização prévia da imagem.
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      
    }

  }


  // Método para manipular a seleção de arquivos (imagem).

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('decription')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('image', this.selectedFile);

      // Enviaando os dados para o lado do backend.
      this.http.post('http://localhost:3000/api/product', formData).subscribe({
        next: (response) => {
          console.log('Produto cadastrado com sucesso!', response);
          },
        error: (error) => {
          console.error('Erro ao cadastrar Produto', error);
          
        }
        
      });
    } else {
      console.log('Formulário Inválido');
      
    }
  }

}
