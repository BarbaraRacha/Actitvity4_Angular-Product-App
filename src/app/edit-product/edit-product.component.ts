import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../services/product.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  productFormGroup! : FormGroup;
  productId! : number;
  constructor(private activatedRoute: ActivatedRoute,
              private productService:ProductService,
              private formBuilder : FormBuilder) {
  }
  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.productService.getProductById(this.productId).subscribe({
      next : (product) => {
        this.productFormGroup = this.formBuilder.group({
          id : this.formBuilder.control(product.id),
          name: this.formBuilder.control(product.name, Validators.required),
          price: this.formBuilder.control(product.price, [Validators.min(100)]),
          checked: this.formBuilder.control(product.checked),
        });

      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  updateProduct() {
    let product = this.productFormGroup.value;
    this.productService.updateProduct(product).subscribe({
      next : data => {
        alert(JSON.stringify(data));
      },
      error : err => {
        console.log(err);
      }
    })
  }
}
