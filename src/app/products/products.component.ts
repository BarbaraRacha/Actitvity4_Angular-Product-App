import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
// @ts-ignore
import Array from "$GLOBAL$";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  constructor(private productService:ProductService,
              private router : Router,
              public appState : AppStateService) {
  }
  ngOnInit(): void {
    this.getProducts();
  }
  public handelCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
        next : updatedProduct => {
          product.checked = !product.checked;
        }
      })
  }
   getProducts() {
    // this.appState.setProductState({status : "LOADING"})
    this.productService.getProducts(
      this.appState.productsState.keyword,
      this.appState.productsState.currentPage,
      this.appState.productsState.pageSize).subscribe({
      next : (resp) => {
        let products = resp.body as Product[];
        let totalProducts : number = parseInt(resp.headers.get('x-total-count')!);
        // this.appState.productsState.totalProducts = totalProducts;
        let totalPages : number = Math.floor(totalProducts / this.appState.productsState.pageSize);
        if(totalProducts % this.appState.productsState.pageSize != 0) {
          totalPages += 1;
        }
        this.appState.setProductState({
          products : products,
          totalPages : totalPages,
          totalProducts : totalProducts,
          status : "LOADED"
        })
      },
      error : err => {
        this.appState.setProductState({
          status : "ERROR",
          errorMessage : err
        })
        console.log(err);
      }
    })
  }

  handleDelete(product: Product) {
    if (confirm("Are you sure?")) {
      this.productService.deleteProduct(product).subscribe({
        next : value  => {
          // this.getProducts();
          //this.appState.productsState.products = this.appState.productsState.products.filter((p: { id: number; })=> p.id != product.id);
          this.getProducts();
        }
      })
    }
  }

  handleGoToPage(page: number) {
    this.appState.productsState.currentPage = page;
    this.getProducts();
  }

  handleEdit(product: Product) {
    this.router.navigateByUrl(`/editProduct/${product.id}`);
  }
}
